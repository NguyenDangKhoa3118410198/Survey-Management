import { CloseOutlined, PlusOutlined } from '@ant-design/icons';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import {
  Button,
  DatePicker,
  Flex,
  Form,
  GetProp,
  Image,
  Input,
  message,
  Modal,
  Radio,
  Select,
  Typography,
  Upload,
  UploadFile,
  UploadProps,
} from 'antd';
import dayjs from 'dayjs';
import React, { useEffect, useState } from 'react';
import { customizeRequiredMark } from 'utils';
import { fetchCities, fetchDistricts, fetchWards } from './services/fetchAPI';
import { useNavigate, useParams } from 'react-router-dom';
import useUser, { IUser } from 'hooks/useUser';

interface FormNewUserProps {
  userDetail?: IUser;
}

const { Option } = Select;
const { Item, List } = Form;

const FormNewUser: React.FC<FormNewUserProps> = React.memo(({ userDetail }) => {
  const [fileList, setFileList] = useState<UploadFile[]>([]);
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const { userList, addNewUser, editUser } = useUser();
  const { id } = useParams();
  const [isUpload, setIsUpload] = useState(false);
  const [deletedAvatar, setDeletedAvatar] = useState(false);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewImage, setPreviewImage] = useState('');
  type FileType = Parameters<GetProp<UploadProps, 'beforeUpload'>>[0];
  const [selectedCity, setSelectedCity] = useState<string[]>([]);
  const [selectedDistrict, setSelectedDistrict] = useState<string[]>([]);
  const [selectedWard, setSelectedWard] = useState<string[]>([]);

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

  const handleCityChange = (value: string, index: number) => {
    const updatedCities = [...selectedCity];
    updatedCities[index] = value;
    setSelectedCity(updatedCities);

    const updatedDistricts = [...selectedDistrict];
    updatedDistricts[index] = '';
    setSelectedDistrict(updatedDistricts);

    const updatedWards = [...selectedWard];
    updatedWards[index] = '';
    setSelectedWard(updatedWards);

    form.resetFields([
      ['addresses', index, 'district'],
      ['addresses', index, 'ward'],
    ]);
  };

  const handleDistrictChange = (value: string, index: number) => {
    const updatedDistricts = [...selectedDistrict];
    updatedDistricts[index] = value;
    setSelectedDistrict(updatedDistricts);

    const updatedWards = [...selectedWard];
    updatedWards[index] = '';
    setSelectedWard(updatedWards);

    form.resetFields([['addresses', index, 'ward']]);
  };

  const handleWardChange = (value: string, index: number) => {
    const updatedWards = [...selectedWard];
    updatedWards[index] = value;
    setSelectedWard(updatedWards);
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
      });
    }
  }, [userDetail, form]);

  const handleChange: UploadProps['onChange'] = (info) => {
    setFileList(info.fileList);
  };

  const submitForm = (values: IUser) => {
    try {
      let pathImg;

      if (deletedAvatar && !values?.avatar?.file?.response?.physicalPath) {
        pathImg = null;
      } else {
        pathImg =
          values?.avatar?.file?.response?.physicalPath ?? userDetail?.avatar;
      }

      const formattedBirthDate =
        dayjs(values.birthDate).format('DD/MM/YYYY') ?? null;

      const updatedUser = {
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

  const getBase64 = (file: FileType): Promise<string> =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = (error) => reject(error);
    });

  const handlePreview = async (file: UploadFile) => {
    if (!file.url && !file.preview) {
      file.preview = await getBase64(file.originFileObj as FileType);
    }

    setPreviewImage(file.url || (file.preview as string));
    setPreviewOpen(true);
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
      >
        {id && (
          <Item label='ID' colon={false}>
            <Typography.Text>{userDetail?.id}</Typography.Text>
          </Item>
        )}

        <Item label='Ảnh đại diện' colon={false}>
          <div>
            {isUpload ? (
              <>
                <Item name='avatar' noStyle>
                  <Upload
                    action='https://api-dev.estuary.solutions:8443/fico-salex-mediafile-dev/files/upload'
                    listType='picture-card'
                    fileList={fileList}
                    onChange={handleChange}
                    maxCount={1}
                    onPreview={handlePreview}
                  >
                    {fileList.length > 0 ? null : (
                      <button
                        style={{ border: 0, background: 'none' }}
                        type='button'
                      >
                        <PlusOutlined />
                        <div style={{ marginTop: 8 }}>Upload</div>
                      </button>
                    )}
                  </Upload>
                </Item>
                {previewImage && (
                  <Image
                    wrapperStyle={{ display: 'none' }}
                    preview={{
                      visible: previewOpen,
                      onVisibleChange: (visible) => setPreviewOpen(visible),
                      afterOpenChange: (visible) =>
                        !visible && setPreviewImage(''),
                    }}
                    src={previewImage}
                  />
                )}
              </>
            ) : userDetail?.avatar ? (
              <>
                <Image
                  src={userDetail?.avatar}
                  style={{
                    width: '100px',
                    height: '100px',
                    objectFit: 'cover',
                  }}
                />
                <CloseOutlined
                  onClick={() => {
                    setIsUpload(true);
                    setDeletedAvatar(true);
                  }}
                  style={{ marginLeft: '10px' }}
                />
              </>
            ) : (
              <>
                <Item name='avatar' noStyle>
                  <Upload
                    action='https://api-dev.estuary.solutions:8443/fico-salex-mediafile-dev/files/upload'
                    listType='picture-card'
                    fileList={fileList}
                    onChange={handleChange}
                    maxCount={1}
                    onPreview={handlePreview}
                  >
                    {fileList.length > 0 ? null : (
                      <button
                        style={{ border: 0, background: 'none' }}
                        type='button'
                      >
                        <PlusOutlined />
                        <div style={{ marginTop: 8 }}>Upload</div>
                      </button>
                    )}
                  </Upload>
                </Item>
                {previewImage && (
                  <Image
                    wrapperStyle={{ display: 'none' }}
                    preview={{
                      visible: previewOpen,
                      onVisibleChange: (visible) => setPreviewOpen(visible),
                      afterOpenChange: (visible) =>
                        !visible && setPreviewImage(''),
                    }}
                    src={previewImage}
                  />
                )}
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
          <Input placeholder='Nhập email' disabled={!!userDetail && !!id} />
        </Item>
        <Item
          label='Mật khẩu'
          name='password'
          colon={false}
          rules={[
            { required: true, message: 'Vui lòng nhập mật khẩu' },
            {
              pattern: /^(?=.*[a-zA-Z])(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{8,}$/,
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
              pattern: /^(?=.*[a-zA-Z])(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{8,}$/,
              message:
                'Mật khẩu đảm bảo có ít nhất 8 ký tự, ít nhất 1 ký tự chữ và ít nhất 1 ký tự đặc biệt',
            },
            ({ getFieldValue }) => ({
              validator(_, value) {
                if (!value || getFieldValue('password') === value) {
                  return Promise.resolve();
                }
                return Promise.reject(new Error('Mật khẩu không trùng khớp'));
              },
            }),
          ]}
        >
          <Input.Password placeholder='Vui lòng xác thực mật khẩu' />
        </Item>
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
              pattern: /^0[1-9]\d{8}$/,
              message: 'Số điện thoại nên bắt đầu với 0 và bao gồm 10 số',
            },
          ]}
        >
          <Input placeholder='Nhập số điện thoại' />
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
                  {fields.map(({ key, name, ...restField }, index) => (
                    <div
                      key={key}
                      style={{
                        display: 'flex',
                        gap: '20px',
                      }}
                    >
                      <Item
                        {...restField}
                        name={[name, 'city']}
                        style={{ flex: 1, marginRight: '8px' }}
                        rules={[
                          {
                            required: true,
                            message: 'Vui lòng chọn thành phố',
                          },
                        ]}
                      >
                        <Select
                          showSearch
                          placeholder='Chọn thành phố'
                          onChange={(value) => handleCityChange(value, index)}
                          allowClear
                          value={selectedCity[index] || undefined}
                          optionFilterProp='label'
                          filterSort={(optionA, optionB) =>
                            (optionA?.label ?? '')
                              .toLowerCase()
                              .localeCompare(
                                (optionB?.label ?? '').toLowerCase()
                              )
                          }
                          options={
                            Array.isArray(cities) && cities.length > 0
                              ? cities.map((city) => ({
                                  label: city?.name,
                                  value: city?.id,
                                }))
                              : []
                          }
                        />
                      </Item>
                      <Item
                        {...restField}
                        name={[name, 'district']}
                        style={{ flex: 1, marginRight: '8px' }}
                        rules={[
                          {
                            required: true,
                            message: 'Vui lòng chọn quận/huyện',
                          },
                        ]}
                        dependencies={[['addresses', name, 'city']]}
                      >
                        <Select
                          showSearch
                          placeholder='Chọn quận/huyện'
                          onChange={(value) =>
                            handleDistrictChange(value, index)
                          }
                          allowClear
                          optionFilterProp='label'
                          value={selectedDistrict[index] || undefined}
                          options={
                            Array.isArray(districts) && districts[index]
                              ? districts[index].map((district: any) => ({
                                  label: district?.name,
                                  value: district?.id,
                                }))
                              : []
                          }
                        />
                      </Item>
                      <Item
                        {...restField}
                        name={[name, 'ward']}
                        style={{ flex: 1 }}
                        rules={[
                          {
                            required: true,
                            message: 'Vui lòng chọn phường/xã!',
                          },
                        ]}
                        dependencies={[
                          ['addresses', name, 'city'],
                          ['addresses', name, 'district'],
                        ]}
                      >
                        <Select
                          showSearch
                          placeholder='Chọn phường/xã'
                          onChange={(value) => handleWardChange(value, index)}
                          allowClear
                          value={selectedWard[index] || undefined}
                          optionFilterProp='label'
                          options={
                            Array.isArray(wards) && wards[index]
                              ? wards[index]?.map((ward: any) => ({
                                  label: ward?.name,
                                  value: ward?.id,
                                }))
                              : []
                          }
                        />
                      </Item>
                      {fields.length > 1 && (
                        <Button
                          onClick={() => handleRemoveAddress(remove, name)}
                          type='link'
                        >
                          <CloseOutlined style={{ color: 'red' }} />
                        </Button>
                      )}
                    </div>
                  ))}
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
            style={{ backgroundColor: 'var(--main-color)' }}
          >
            {userDetail ? 'Cập nhật' : 'Tạo mới'}
          </Button>
        </Item>
      </Form>
    </>
  );
});

export default FormNewUser;
