import { CloseOutlined, PlusOutlined } from '@ant-design/icons';
import { useQuery } from '@tanstack/react-query';
import {
  Button,
  DatePicker,
  Flex,
  Form,
  Image,
  Input,
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
import {
  fetchCities,
  fetchDistricts,
  fetchUserbyId,
  fetchWards,
} from './services/fetchAPI';
import { useNavigate, useParams } from 'react-router-dom';
import useUser, { IAddress, IUser } from 'hooks/useUser';

interface IApiAddress {
  id?: string;
  name?: string;
  name_en?: string;
  full_name?: string;
  full_name_en?: string;
  latitude?: string;
  longitude?: string;
}

const { Option } = Select;
const { Item, List } = Form;

const FormNewUser: React.FC = () => {
  const [fileList, setFileList] = useState<UploadFile[]>([]);
  const [selectedCity, setSelectedCity] = useState<string | undefined>();
  const [selectedDistrict, setSelectedDistrict] = useState<
    string | undefined
  >();
  const [selectedWard, setSelectedWard] = useState<string | undefined>();
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const { userList, addNewUser } = useUser();
  const { id } = useParams();
  const [isUpload, setIsUpload] = useState(false);

  const { data: userDetail } = useQuery<IUser | undefined>({
    queryKey: ['userDetail', id],
    queryFn: () => {
      if (id) {
        return fetchUserbyId(id);
      }
      return undefined;
    },
    enabled: !!id,
  });

  const { data: cities } = useQuery({
    queryKey: ['cityVN'],
    queryFn: fetchCities,
  });

  const { data: districts } = useQuery({
    queryKey: ['districtVN', selectedCity],
    queryFn: () => {
      if (selectedCity) {
        return fetchDistricts(selectedCity);
      }

      return [];
    },
    enabled: !!selectedCity,
  });

  const { data: wards } = useQuery({
    queryKey: ['wardVN', selectedDistrict],
    queryFn: () => {
      if (selectedDistrict) {
        return fetchWards(selectedDistrict);
      }
      return [];
    },
    enabled: !!selectedDistrict,
  });

  useEffect(() => {
    if (userDetail) {
      const { birthDate, originBirthDate, addresses, ...restUserDetail } =
        userDetail;
      const processedAddresses = addresses?.map((address) => ({
        city: address?.city?.split('-')[1],
        district: address?.district?.split('-')[1],
        ward: address?.ward?.split('-')[1],
      }));

      form.setFieldsValue({
        ...restUserDetail,
        addresses: processedAddresses || [{}],
        gender: restUserDetail.gender || 'Nam',
        birthDate: dayjs(originBirthDate),
      });
    }
  }, [userDetail, form]);

  const handleChange: UploadProps['onChange'] = (info) => {
    setFileList(info.fileList);
  };

  const handleSubmit = (values: IUser) => {
    try {
      const pathImg = values?.avatar?.file?.response?.physicalPath;
      const formattedBirthDate = dayjs(values.birthDate).format('DD/MM/YYYY');

      const newUser = {
        ...values,
        id: userList.length + 1,
        avatar: pathImg,
        birthDate: formattedBirthDate,
        originBirthDate: values.birthDate,
      };
      addNewUser(newUser);
      navigate('/users');
    } catch (error) {
      console.log('Submit failed');
    }
  };

  const handleAddressesChange = (
    index: number,
    value: string,
    name: string
  ) => {
    if (name === 'city') setSelectedCity(value);
    if (name === 'district') setSelectedDistrict(value);
    if (name === 'ward') setSelectedWard(value);

    const updatedAddresses = form
      .getFieldValue('addresses')
      ?.map((address: IAddress, i: number) => {
        if (index === i) {
          const newAddress = { ...address };
          if (name === 'city') {
            newAddress.district = undefined;
            newAddress.ward = undefined;
          } else if (name === 'district') {
            newAddress.ward = undefined;
          }

          return newAddress;
        }
        return address;
      });
    form.setFieldsValue({ addresses: updatedAddresses });
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
            <Typography.Text>{id}</Typography.Text>
          </Item>
        )}

        <Item label='Ảnh đại diện' name='avatar' colon={false}>
          {isUpload ? (
            <Upload
              action='https://api-dev.estuary.solutions:8443/fico-salex-mediafile-dev/files/upload'
              listType='picture-card'
              fileList={fileList}
              onChange={handleChange}
              maxCount={1}
            >
              <button style={{ border: 0, background: 'none' }} type='button'>
                <PlusOutlined />
                <div style={{ marginTop: 8 }}>Upload</div>
              </button>
            </Upload>
          ) : userDetail?.avatar ? (
            <>
              <Image
                src={userDetail?.avatar}
                style={{ width: '100px', height: '100px', objectFit: 'cover' }}
              />
              <CloseOutlined
                onClick={() => setIsUpload(true)}
                style={{ marginLeft: '10px' }}
              />
            </>
          ) : (
            <Upload
              action='https://api-dev.estuary.solutions:8443/fico-salex-mediafile-dev/files/upload'
              listType='picture-card'
              fileList={fileList}
              onChange={handleChange}
              maxCount={1}
            >
              <button style={{ border: 0, background: 'none' }} type='button'>
                <PlusOutlined />
                <div style={{ marginTop: 8 }}>Upload</div>
              </button>
            </Upload>
          )}
        </Item>
        <Item
          label='Họ và tên'
          name='fullName'
          colon={false}
          rules={[{ required: true, message: 'Vui lòng nhập họ và tên!' }]}
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
                            message: 'Vui lòng chọn thành phố!',
                          },
                        ]}
                      >
                        <Select
                          placeholder='Chọn thành phố'
                          onChange={(value) =>
                            handleAddressesChange(index, value, 'city')
                          }
                          allowClear
                          value={selectedCity || undefined}
                        >
                          {Array.isArray(cities) &&
                            cities.length > 0 &&
                            cities.map((city: IApiAddress) => (
                              <Option
                                key={city?.id}
                                value={`${city?.id}-${city?.name}`}
                              >
                                {city?.name ?? city?.name_en}
                              </Option>
                            ))}
                        </Select>
                      </Item>
                      <Item
                        {...restField}
                        name={[name, 'district']}
                        style={{ flex: 1, marginRight: '8px' }}
                        rules={[
                          {
                            required: true,
                            message: 'Vui lòng chọn quận/huyện!',
                          },
                        ]}
                      >
                        <Select
                          placeholder='Chọn quận/huyện'
                          onChange={(value) =>
                            handleAddressesChange(index, value, 'district')
                          }
                          value={selectedDistrict || undefined}
                          allowClear
                        >
                          {Array.isArray(districts) &&
                            districts.length > 0 &&
                            districts.map((district: IApiAddress) => (
                              <Option
                                key={district?.id}
                                value={`${district?.id}-${district?.name}`}
                              >
                                {district?.name ?? district?.name_en}
                              </Option>
                            ))}
                        </Select>
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
                      >
                        <Select
                          placeholder='Chọn phường/xã'
                          onChange={(value) =>
                            handleAddressesChange(index, value, 'ward')
                          }
                          value={selectedWard || undefined}
                          allowClear
                        >
                          {Array.isArray(wards) &&
                            wards.length > 0 &&
                            wards.map((ward: IApiAddress) => (
                              <Option
                                key={ward?.id}
                                value={`${ward?.id}-${ward?.name}`}
                              >
                                {ward?.name ?? ward?.name_en}
                              </Option>
                            ))}
                        </Select>
                      </Item>
                      {fields.length > 1 && (
                        <Button onClick={() => remove(name)} type='link'>
                          <CloseOutlined />
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
            Tạo mới
          </Button>
        </Item>
      </Form>
    </>
  );
};

export default FormNewUser;
