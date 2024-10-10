import { CloseOutlined, DeleteOutlined } from '@ant-design/icons';
import { useQuery } from '@tanstack/react-query';
import {
  Button,
  DatePicker,
  Flex,
  Form,
  Image,
  Input,
  message,
  Modal,
  Radio,
  Select,
  Typography,
  UploadFile,
} from 'antd';
import dayjs from 'dayjs';
import React, { useEffect, useState } from 'react';
import { customizeRequiredMark, generateRandomPassword } from 'utils';
import { fetchCities, fetchDistricts, fetchWards } from './services/fetchAPI';
import { useNavigate, useParams } from 'react-router-dom';
import useUser, { IUser } from 'hooks/useUser';
import UploadImage from 'components/common/UploadImage';
import PhoneInput from 'react-phone-input-2';
import 'react-phone-input-2/lib/style.css';
import CImage from 'components/common/CImage';
import AddressFormItem from './AddressFormItem';

interface FormNewUserProps {
  userDetail?: IUser;
}

const { Item, List } = Form;

const FormNewUser: React.FC<FormNewUserProps> = React.memo(({ userDetail }) => {
  const { id } = useParams();
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const { userList, addNewUser, editUser } = useUser();
  const [fileList, setFileList] = useState<UploadFile[]>([]);
  const [isUpload, setIsUpload] = useState<boolean>(false);
  const [deletedAvatar, setDeletedAvatar] = useState<boolean>(false);
  const [selectedCity, setSelectedCity] = useState<string[]>([]);
  const [selectedDistrict, setSelectedDistrict] = useState<string[]>([]);
  const [selectedWard, setSelectedWard] = useState<string[]>([]);
  const [isFormModified, setIsFormModified] = useState<boolean>(false);
  const [isDisabledEmail, setIsDisabledEmail] = useState<boolean>(false);
  const [isResetPassword, setIsResetPassword] = useState<boolean>(false);

  const { data: cities } = useQuery({
    queryKey: ['cityVN'],
    queryFn: fetchCities,
  });

  const fetchDistrictsByCityId = (cityId: string) => {
    return cityId?.length ? fetchDistricts(cityId) : [];
  };

  const fetchWardsByDistrictId = (districtId: string) => {
    return districtId?.length ? fetchWards(districtId) : [];
  };

  const { data: districts } = useQuery({
    queryKey: ['districtVN', selectedCity],
    queryFn: () => {
      return Promise.all(
        selectedCity.map((cityId) => fetchDistrictsByCityId(cityId))
      );
    },
    enabled: selectedCity.length > 0,
  });

  const { data: wards } = useQuery({
    queryKey: ['wardVN', selectedDistrict],
    queryFn: () => {
      return Promise.all(
        selectedDistrict.map((districtId) => fetchWardsByDistrictId(districtId))
      );
    },
    enabled: selectedDistrict.length > 0,
  });

  const updateAddressAtIndex = (
    setter: React.Dispatch<React.SetStateAction<string[]>>,
    array: string[],
    index: number,
    value: string
  ) => {
    const updatedArray = [...array];
    updatedArray[index] = value;
    setter(updatedArray);
  };

  const handleCityChange = (value: string, index: number) => {
    updateAddressAtIndex(setSelectedCity, selectedCity, index, value);
    updateAddressAtIndex(setSelectedDistrict, selectedDistrict, index, '');
    updateAddressAtIndex(setSelectedWard, selectedWard, index, '');

    form.resetFields([
      ['addresses', index, 'district'],
      ['addresses', index, 'ward'],
    ]);
  };

  const handleDistrictChange = (value: string, index: number) => {
    updateAddressAtIndex(setSelectedDistrict, selectedDistrict, index, value);
    updateAddressAtIndex(setSelectedWard, selectedWard, index, ''); // Reset ward

    form.resetFields([['addresses', index, 'ward']]);
  };

  const handleWardChange = (value: string, index: number) => {
    updateAddressAtIndex(setSelectedWard, selectedWard, index, value);
  };

  const showConfirm = (values: IUser) => {
    Modal.confirm({
      title: 'Xác nhận',
      content: 'Bạn có chắc chắn muốn lưu thông tin này?',
      onOk: () => submitForm(values),
      onCancel() {
        return;
      },
    });
  };

  useEffect(() => {
    if (userDetail) {
      const {
        birthDate,
        originBirthDate,
        addresses,
        avatar,
        idsAddress,
        phoneNumber,
        ...restUserDetail
      } = userDetail;

      if (idsAddress) {
        idsAddress.forEach((element, index) => {
          if (index === 0) {
            setSelectedCity([...selectedCity, ...element]);
          } else if (index === 1) {
            setSelectedDistrict([...selectedDistrict, ...element]);
          } else if (index === 2) {
            setSelectedWard([...selectedWard, ...element]);
          }
        });
      }

      form.setFieldsValue({
        ...restUserDetail,
        addresses: addresses || [{}],
        gender: restUserDetail.gender || 'Nam',
        birthDate: dayjs(originBirthDate) ?? null,
        phoneNumber: phoneNumber,
      });
    }
  }, [userDetail, form]);

  const submitForm = (values: IUser) => {
    try {
      let pathImg = null;
      if (fileList.length > 0 && fileList[0].response) {
        pathImg = fileList[0].response.physicalPath ?? null;
      }

      if (deletedAvatar && !pathImg) {
        pathImg = null;
      } else {
        pathImg = pathImg ?? userDetail?.avatar;
      }

      const formattedBirthDate =
        dayjs(values.birthDate).format('DD/MM/YYYY') ?? null;

      const updatedUser = {
        ...userDetail,
        ...values,
        avatar: pathImg,
        birthDate: formattedBirthDate,
        originBirthDate: values.birthDate,
        idsAddress: [selectedCity, selectedDistrict, selectedWard],
      };

      if (userDetail?.id) {
        editUser({ ...updatedUser, id: userDetail.id });
        message.success('Sửa thành công');
      } else {
        const newUser = {
          ...updatedUser,
          id: userList.length + 1,
        };

        const isEmailValid = userList.find(
          (user) => user.email === newUser.email
        );

        if (!!isEmailValid) {
          message.warning('Email đã tồn tại');
          return;
        }

        addNewUser(newUser);
        navigate('/users');
        message.success('Tạo mới thành công');
      }
    } catch (error) {
      console.log('Submit failed', error);
    }
  };

  const handleSubmit = (values: IUser) => {
    showConfirm(values);
  };

  const handleRemoveAddress = (remove: any, name: number) => {
    remove(name);

    const updatedCities = [...selectedCity];
    updatedCities.splice(name, 1);
    setSelectedCity(updatedCities);

    const updatedDistricts = [...selectedDistrict];
    updatedDistricts.splice(name, 1);
    setSelectedDistrict(updatedDistricts);

    const updatedWards = [...selectedWard];
    updatedWards.splice(name, 1);
    setSelectedWard(updatedWards);
  };

  const handleFileListChange = (newFileList: UploadFile[]) => {
    setFileList(newFileList);
  };

  const handlePhoneChange = (value: string) => {
    form.setFieldsValue({ phoneNumber: value });
  };

  const handleCreateRandomPassword = () => {
    const ramdomPassword = generateRandomPassword();
    setIsFormModified(true);
    form.setFieldsValue({
      password: ramdomPassword,
      verifyPassword: ramdomPassword,
    });
  };

  const handleValuesChange = () => {
    setIsFormModified(true);
  };

  const handleResetImage = () => {
    setIsUpload(true);
    setDeletedAvatar(true);
    setIsFormModified(true);
  };

  return (
    <>
      <Form
        form={form}
        autoComplete='false'
        onFinish={handleSubmit}
        layout='horizontal'
        requiredMark={customizeRequiredMark}
        initialValues={{
          addresses: [{}],
          gender: 'Nam',
        }}
        onValuesChange={handleValuesChange}
      >
        {userDetail?.id && (
          <Item label='ID' colon={false}>
            <Typography.Text>{userDetail?.id}</Typography.Text>
          </Item>
        )}

        <Item label='Ảnh đại diện' colon={false}>
          <div>
            {isUpload ? (
              <>
                <Item name='avatar' noStyle>
                  <UploadImage
                    fileList={fileList}
                    onChange={handleFileListChange}
                  />
                </Item>
              </>
            ) : userDetail?.avatar ? (
              <>
                <CImage
                  userDetail={userDetail}
                  handleResetImage={handleResetImage}
                />
              </>
            ) : (
              <>
                <Item name='avatar' noStyle>
                  <UploadImage
                    fileList={fileList}
                    onChange={handleFileListChange}
                  />
                </Item>
              </>
            )}
          </div>
        </Item>

        <Item
          label='Họ và tên'
          name='fullName'
          colon={false}
          rules={[{ required: true, message: 'Vui lòng nhập họ và tên' }]}
        >
          <Input placeholder='Nhập họ và tên' />
        </Item>
        <Item
          label='Email'
          name='email'
          colon={false}
          rules={[
            { required: true, message: 'Vui lòng nhập email' },
            {
              pattern: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
              message: 'Email không hợp lệ',
            },
          ]}
        >
          <Input
            placeholder='Nhập email'
            disabled={!!userDetail && !!id && !isDisabledEmail}
          />
        </Item>
        {(!userDetail || (userDetail && isResetPassword)) && (
          <>
            <Item
              label='Mật khẩu'
              name='password'
              colon={false}
              rules={[
                { required: true, message: 'Vui lòng nhập mật khẩu' },
                {
                  pattern:
                    /^(?=.*[a-zA-Z])(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{8,}$/,
                  message:
                    'Mật khẩu đảm bảo có ít nhất 8 ký tự, ít nhất 1 ký tự chữ và ít nhất 1 ký tự đặc biệt',
                },
              ]}
            >
              <Input.Password placeholder='Nhập mật khẩu' />
            </Item>

            <Item
              label='Xác thực mật khẩu'
              name='verifyPassword'
              colon={false}
              dependencies={['password']}
              rules={[
                { required: true, message: 'Vui lòng xác thực mật khẩu' },
                {
                  pattern:
                    /^(?=.*[a-zA-Z])(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{8,}$/,
                  message:
                    'Mật khẩu đảm bảo có ít nhất 8 ký tự, ít nhất 1 ký tự chữ và ít nhất 1 ký tự đặc biệt',
                },
                ({ getFieldValue }) => ({
                  validator(_, value) {
                    if (!value || getFieldValue('password') === value) {
                      return Promise.resolve();
                    }
                    return Promise.reject(
                      new Error('Mật khẩu không trùng khớp')
                    );
                  },
                }),
              ]}
            >
              <Input.Password placeholder='Vui lòng xác thực mật khẩu' />
            </Item>
            <Item label='' colon={false} wrapperCol={{ span: 24, offset: 0 }}>
              <Button onClick={handleCreateRandomPassword}>
                Tạo mật khẩu ngẫu nhiên
              </Button>
            </Item>
          </>
        )}

        <Item label='Giới tính' colon={false} name='gender'>
          <Radio.Group>
            <Radio value='Nam'>Nam</Radio>
            <Radio value='Nữ'> Nữ </Radio>
            <Radio value='Khác'> Khác </Radio>
          </Radio.Group>
        </Item>
        <Item
          label='Số điện thoại'
          name='phoneNumber'
          colon={false}
          rules={[
            {
              pattern: /^\+?\d{10,15}$/,
              message: 'Số điện thoại không hợp lệ',
            },
          ]}
        >
          <PhoneInput
            country='vn'
            value={form.getFieldValue('phoneNumber')}
            onChange={handlePhoneChange}
            placeholder='Nhập số điện thoại'
          />
        </Item>
        <Item
          label='Ngày sinh'
          name='birthDate'
          colon={false}
          rules={[{ required: true, message: 'Vui lòng nhập ngày sinh' }]}
        >
          <DatePicker
            format='DD/MM/YYYY'
            placeholder='Chọn ngày sinh'
            disabledDate={(current) =>
              current && current.isAfter(dayjs().endOf('day'))
            }
            style={{ borderRadius: '14px' }}
          />
        </Item>
        <List name='addresses'>
          {(fields, { add, remove }) => (
            <>
              <Flex>
                <Typography.Text style={{ width: '190px', textAlign: 'left' }}>
                  Địa chỉ
                  <span style={{ color: 'red' }}> *</span>
                </Typography.Text>
                <Flex vertical style={{ width: '100%' }}>
                  {fields.map(({ key, name, ...restField }, index) => {
                    return (
                      <AddressFormItem
                        itemKey={name}
                        restField={restField}
                        name={name}
                        index={index}
                        cities={cities ?? []}
                        districts={districts ?? []}
                        wards={wards ?? []}
                        selectedCity={selectedCity ?? []}
                        selectedDistrict={selectedDistrict ?? []}
                        handleCityChange={handleCityChange}
                        handleDistrictChange={handleDistrictChange}
                        handleWardChange={handleWardChange}
                        handleRemoveAddress={handleRemoveAddress}
                        userDetail={userDetail}
                        remove={remove}
                        fields={fields}
                      />
                    );
                  })}
                  <Item>
                    <Button
                      type='dashed'
                      onClick={() => add()}
                      block
                      style={{ borderRadius: '14px' }}
                    >
                      + Thêm địa chỉ
                    </Button>
                  </Item>
                </Flex>
              </Flex>
            </>
          )}
        </List>

        <Item
          style={{
            display: 'flex',
            justifyContent: 'flex-end',
            width: '100%',
          }}
        >
          {userDetail && (
            <Button
              htmlType='button'
              style={{
                marginRight: '10px',
                border: '1px solid var(--main-color)',
              }}
              onClick={() => setIsResetPassword(true)}
            >
              Reset Password
            </Button>
          )}
          <Button
            htmlType='button'
            style={{
              marginRight: '10px',
              border: '1px solid var(--main-color)',
            }}
            onClick={() => {
              form.resetFields();
              setFileList([]);
              handleResetImage();
              setIsDisabledEmail(true);
            }}
          >
            Reset
          </Button>
          <Button
            htmlType='button'
            style={{ marginRight: '10px' }}
            onClick={() => navigate('/users')}
          >
            Hủy bỏ
          </Button>
          <Button
            type='primary'
            htmlType='submit'
            style={{
              backgroundColor: !isFormModified
                ? 'lightgray'
                : 'var(--main-color)',
            }}
            disabled={!isFormModified}
          >
            {userDetail ? 'Cập nhật' : 'Tạo mới'}
          </Button>
        </Item>
      </Form>
    </>
  );
});

export default FormNewUser;
