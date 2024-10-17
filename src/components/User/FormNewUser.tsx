import { EditOutlined, RetweetOutlined } from '@ant-design/icons';
import { useQuery } from '@tanstack/react-query';
import {
  Button,
  DatePicker,
  Flex,
  Form,
  Input,
  message,
  Modal,
  Radio,
  Tag,
  UploadFile,
} from 'antd';
import dayjs from 'dayjs';
import React, { useCallback, useEffect, useState } from 'react';
import { customizeRequiredMark, defaultPassword, USER_STATUS } from 'utils';
import {
  fetchCities,
  fetchDistricts,
  fetchUserbyId,
  fetchWards,
} from './services/fetchAPI';
import { useNavigate, useParams } from 'react-router-dom';
import useUser, { IUser } from 'hooks/useUser';
import UploadImage from 'components/common/UploadImage';
import PhoneInput, { CountryData } from 'react-phone-input-2';
import 'react-phone-input-2/lib/style.css';
import AddressFormItem from './AddressFormItem';
import { useWatch } from 'antd/es/form/Form';
import isEqual from 'lodash/isEqual';

interface FormNewUserProps {
  userDetail?: IUser;
}

const { Item, List } = Form;

const FormNewUser: React.FC<FormNewUserProps> = React.memo(() => {
  const { id } = useParams();
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const { userList, addNewUser, editUser, changeStatusUser } = useUser();
  const [fileList, setFileList] = useState<UploadFile[]>([]);
  const [selectedCity, setSelectedCity] = useState<string[]>([]);
  const [selectedDistrict, setSelectedDistrict] = useState<string[]>([]);
  const [selectedWard, setSelectedWard] = useState<string[]>([]);
  const [selectedAddressNumber, setSelectedAddressNumber] = useState<string[]>(
    []
  );
  const [isFormModified, setIsFormModified] = useState<boolean>(false);

  const { data: userDetail, refetch } = useQuery<IUser | undefined>({
    queryKey: ['userDetail', id],
    queryFn: () => (id ? fetchUserbyId(id) : undefined),
    enabled: !!id,
  });
  const [visible, setVisible] = useState(false);
  const userStatus = useUser.getState().getStatusById(Number(userDetail?.id));
  const [selectStatus, setSelectStatus] = useState(userStatus || '');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [image, setImage] = useState('');

  const handleValuesChange = (changedValues: any) => {
    const initData = { ...userDetail };
    const newData = { ...initData, ...changedValues };

    if (changedValues.birthDate) {
      newData.birthDate = dayjs(changedValues.birthDate).format('DD/MM/YYYY');
    }

    setIsFormModified(!isEqual(initData, newData));
  };

  const isAddressUpdated = (initialAddress: any) => {
    const currentAddress = [
      selectedAddressNumber,
      selectedCity,
      selectedDistrict,
      selectedWard,
    ];

    return !isEqual(initialAddress, currentAddress);
  };

  useEffect(() => {
    const initData = { ...userDetail };
    const addressUpdated = isAddressUpdated(initData.idsAddress);
    setIsFormModified(addressUpdated);
  }, [selectedAddressNumber, selectedCity, selectedDistrict, selectedWard]);

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
    updateAddressAtIndex(setSelectedWard, selectedWard, index, '');

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

  const fillValue = useCallback(() => {
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
            setSelectedAddressNumber([...selectedAddressNumber, ...element]);
          } else if (index === 1) {
            setSelectedCity([...selectedCity, ...element]);
          } else if (index === 2) {
            setSelectedDistrict([...selectedDistrict, ...element]);
          } else if (index === 3) {
            setSelectedWard([...selectedWard, ...element]);
          }
        });
      }

      setImage(avatar ?? null);
      setSelectStatus(userDetail.status ?? '');

      form.setFieldsValue({
        ...restUserDetail,
        addresses: addresses || [{}],
        gender: restUserDetail.gender || 'Nam',
        birthDate: dayjs(originBirthDate) ?? null,
        phoneNumber: phoneNumber,
      });
    }
  }, [userDetail]);

  useEffect(() => {
    fillValue();
  }, [userDetail, form]);

  const submitForm = (values: IUser) => {
    try {
      let pathImg = null;

      if (userDetail?.avatar?.length === 0) {
        pathImg = userDetail?.avatar;
      }

      if (fileList.length > 0 && fileList[0]?.response) {
        pathImg = fileList[0].response.physicalPath ?? null;
      }

      if (values?.avatar?.length > 0 && values.avatar[0]?.url) {
        pathImg = values.avatar[0].url ?? null;
      }

      const formattedBirthDate =
        dayjs(values.birthDate).format('DD/MM/YYYY') ?? null;

      const updatedUser = {
        ...userDetail,
        ...values,
        avatar: pathImg,
        birthDate: formattedBirthDate,
        originBirthDate: values.birthDate,
        idsAddress: [
          selectedAddressNumber,
          selectedCity,
          selectedDistrict,
          selectedWard,
        ],
        status: userStatus || 'Hoạt động',
      };

      if (userDetail?.id) {
        editUser({ ...updatedUser, id: userDetail.id });
        message.success('Sửa thành công');
      } else {
        const newUser = {
          ...updatedUser,
          id: userList.length + 1,
          status: 'Hoạt động',
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
      refetch();
    } catch (error) {
      console.error('Submit failed', error);
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

  const handleChangeAddressNumber = (value: string, index: number) => {
    updateAddressAtIndex(
      setSelectedAddressNumber,
      selectedAddressNumber,
      index,
      value
    );
  };

  const showModal = () => {
    setVisible(true);
    console.log('click');
  };

  const handleOk = () => {
    if (userDetail) {
      changeStatusUser(userDetail.id, selectStatus);
    }
    setVisible(false);
  };

  const handleCancel = () => {
    setVisible(false);
  };

  const handleRadioChange = (e: any) => {
    setSelectStatus(e.target.value);
  };

  const getTagColor = (status: string | undefined) => {
    switch (status) {
      case 'Hoạt động':
        return 'green';
      case 'Tạm ngưng':
        return 'orange';
      case 'Khóa':
        return 'red';
      default:
        return 'default';
    }
  };

  return (
    <>
      {userDetail && (
        <Flex align='center' justify='flex-end'>
          <Tag color={getTagColor(userDetail ? userStatus : undefined)}>
            {userStatus || 'Chưa chọn'}
          </Tag>
          <EditOutlined
            onClick={showModal}
            style={{
              border: '1px solid #000',
              padding: '4px',
              borderRadius: '4px',
            }}
          />
        </Flex>
      )}

      <Modal
        title='Chọn trạng thái'
        open={visible}
        onOk={handleOk}
        onCancel={handleCancel}
      >
        <Radio.Group onChange={handleRadioChange}>
          {userStatus === 'Hoạt động' && (
            <Radio value='Tạm ngưng'>Tạm ngưng</Radio>
          )}
          {userStatus === 'Tạm ngưng' && (
            <>
              <Radio value='Hoạt động'>Hoạt động</Radio>
              <Radio value='Khóa'>Khóa</Radio>
            </>
          )}
        </Radio.Group>
      </Modal>

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
        disabled={userDetail && userStatus !== 'Tạm ngưng'}
      >
        <Item label='Ảnh đại diện' colon={false}>
          <Item name='avatar' noStyle>
            <UploadImage
              fileList={fileList}
              onChange={handleFileListChange}
              avatarImage={image}
            />
          </Item>
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
          <Input placeholder='Nhập email' disabled={!!userDetail && !!id} />
        </Item>
        {!userDetail && (
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
            disabled={userDetail && userStatus !== 'Tạm ngưng'}
            country={'vn'}
            value={phoneNumber}
            placeholder='Nhập số điện thoại (không bắt buộc)'
            countryCodeEditable={false}
            onChange={(phone, country: CountryData | {}) => {
              if ('dialCode' in country) {
                const dialCode = (country as CountryData).dialCode;

                if (phone.startsWith('0')) {
                  setPhoneNumber(phone.substring(1));
                } else if (phone.startsWith(`+${dialCode}`)) {
                  setPhoneNumber(phone);
                } else {
                  setPhoneNumber(`+${dialCode}${phone}`);
                }
              } else {
                setPhoneNumber(
                  phone.startsWith('+') ? phone.substring(1) : phone
                );
              }
            }}
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
            <Item label='Địa chỉ' colon={false}>
              <Flex>
                <Flex vertical style={{ width: '100%' }}>
                  {fields.map(({ key, name, ...restField }, index) => {
                    return (
                      <div key={key}>
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
                          handleChangeAddressNumber={handleChangeAddressNumber}
                          handleCityChange={handleCityChange}
                          handleDistrictChange={handleDistrictChange}
                          handleWardChange={handleWardChange}
                          handleRemoveAddress={handleRemoveAddress}
                          userDetail={userDetail}
                          remove={remove}
                          fields={fields}
                          form={form}
                          userStatus={userStatus}
                        />
                      </div>
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
            </Item>
          )}
        </List>

        <Item
          style={{
            display: 'flex',
            justifyContent: 'flex-end',
            width: '100%',
          }}
        >
          {userDetail && isFormModified && (
            <Button
              htmlType='button'
              style={{
                marginRight: '10px',
                border: '1px solid var(--main-color)',
              }}
              onClick={() => {
                fillValue();
              }}
            >
              Hủy thay đổi
            </Button>
          )}

          {isFormModified && (
            <>
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
                  backgroundColor:
                    isFormModified && userStatus === 'Tạm ngưng'
                      ? 'var(--main-color)'
                      : 'lightgray',
                }}
                disabled={!isFormModified || userStatus !== 'Tạm ngưng'}
              >
                {userDetail ? 'Cập nhật' : 'Tạo mới'}
              </Button>
            </>
          )}
        </Item>
      </Form>
    </>
  );
});

export default FormNewUser;
