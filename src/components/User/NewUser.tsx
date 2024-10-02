import { CloseOutlined, PlusOutlined } from '@ant-design/icons';
import { useQuery } from '@tanstack/react-query';
import {
   Button,
   DatePicker,
   Divider,
   Form,
   Input,
   Radio,
   Select,
   Typography,
   Upload,
   UploadFile,
   UploadProps,
} from 'antd';
import React, { useState } from 'react';

interface IApiAddress {
   id?: string;
   name?: string;
   name_en?: string;
   full_name?: string;
   full_name_en?: string;
   latitude?: string;
   longitude?: string;
}

interface IAddress {
   city: string;
   district: string;
   ward: string;
}

interface IFormData {
   addresses: string[];
   avatar: {};
   birthDate: Date;
   email: string;
   fullName: string;
   gender: string;
   password: string;
   phoneNumber: string;
   verifyPassword: string;
}

const NewUser: React.FC = () => {
   const [fileList, setFileList] = useState<UploadFile[]>([]);
   const { Option } = Select;
   const { Item, List } = Form;
   const [form] = Form.useForm();

   const [selectedCity, setSelectedCity] = useState<string>();
   const [selectedDistrict, setSelectedDistrict] = useState<string>();
   const [selectedWard, setSelectedWard] = useState<string>();

   const fetchCities = async () => {
      const data = await fetch('https://esgoo.net/api-tinhthanh/1/0.htm').then(
         (res) => res.json()
      );
      return data.data;
   };

   const fetchDistricts = async (cityId: string) => {
      const data = await fetch(
         ` https://esgoo.net/api-tinhthanh/2/${cityId}.htm`
      ).then((res) => res.json());
      return data.data;
   };

   const fetchWards = async (districtId: string) => {
      const data = await fetch(
         `https://esgoo.net/api-tinhthanh/3/${districtId}.htm`
      ).then((res) => res.json());
      return data.data;
   };

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

   const handleChange: UploadProps['onChange'] = (info) => {
      setFileList(info.fileList);
   };

   const handleSubmit = (values: IFormData) => {
      console.log('Received values:', values);
   };

   const customizeRequiredMark = (
      label: React.ReactNode,
      { required }: { required: boolean }
   ) => (
      <>
         {label && (
            <span style={{ width: '150px', textAlign: 'left' }}>
               {label}
               {required && <span style={{ color: 'red' }}> *</span>}
            </span>
         )}
      </>
   );

   const handleCityChange = (index: number, value: string) => {
      setSelectedCity(value);
      form.setFieldsValue({
         addresses: form
            .getFieldValue('addresses')
            .map((address: IAddress, i: number) => {
               if (i === index) {
                  return {
                     ...address,
                     district: undefined,
                     ward: undefined,
                  };
               }
               return address;
            }),
      });
   };

   const handleDistrictChange = (index: number, value: string) => {
      setSelectedDistrict(value);
      form.setFieldsValue({
         addresses: form
            .getFieldValue('addresses')
            .map((address: IAddress, i: number) => {
               if (i === index) {
                  return {
                     ...address,
                     ward: undefined,
                  };
               }
               return address;
            }),
      });
   };

   const handleWardChange = (value: string) => {
      setSelectedWard(value);
   };

   return (
      <div
         style={{
            backgroundColor: '#fff',
            height: 'calc(100vh - 150px)',
            overflowY: 'auto',
         }}
      >
         <Typography.Paragraph
            style={{
               fontSize: '18px',
               fontWeight: '700',
               margin: '0',
               padding: '8px 11px',
            }}
         >
            Tạo người dùng
         </Typography.Paragraph>
         <Divider style={{ margin: '10px 0' }} />
         <div style={{ padding: '8px 11px' }}>
            <Form
               form={form}
               autoComplete='false'
               onFinish={handleSubmit}
               layout='horizontal'
               requiredMark={customizeRequiredMark}
               initialValues={{ addresses: [{}] }}
            >
               <Item label='Ảnh đại diện' name='avatar' colon={false}>
                  <Upload
                     action='https://api-dev.estuary.solutions:8443/fico-salex-mediafile-dev/files/upload'
                     listType='picture-card'
                     fileList={fileList}
                     onChange={handleChange}
                     maxCount={1}
                  >
                     <button
                        style={{ border: 0, background: 'none' }}
                        type='button'
                     >
                        <PlusOutlined />
                        <div style={{ marginTop: 8 }}>Upload</div>
                     </button>
                  </Upload>
               </Item>
               <Item
                  label='Họ và tên'
                  name='fullName'
                  colon={false}
                  rules={[
                     { required: true, message: 'Vui lòng nhập họ và tên!' },
                  ]}
               >
                  <Input placeholder='Nhập họ và tên' />
               </Item>
               <Item
                  label='Email'
                  name='email'
                  colon={false}
                  rules={[{ required: true, message: 'Vui lòng nhập email' }]}
               >
                  <Input placeholder='Nhập email' />
               </Item>
               <Item
                  label='Mật khẩu'
                  name='password'
                  colon={false}
                  rules={[
                     { required: true, message: 'Vui lòng nhập mật khẩu' },
                  ]}
               >
                  <Input.Password placeholder='Nhập mật khẩu' />
               </Item>
               <Item
                  label='Xác thực mật khẩu'
                  name='verifyPassword'
                  colon={false}
                  rules={[
                     { required: true, message: 'Vui lòng xác thực mật khẩu' },
                  ]}
               >
                  <Input.Password placeholder='Vui lòng xác thực mật khẩu' />
               </Item>
               <Item label='Giới tính' colon={false} name='gender'>
                  <Radio.Group defaultValue='male'>
                     <Radio value='male'>Nam</Radio>
                     <Radio value='female'> Nữ </Radio>
                     <Radio value='other'> Khác </Radio>
                  </Radio.Group>
               </Item>
               <Item
                  label='Số điện thoại'
                  name='phoneNumber'
                  colon={false}
                  rules={[
                     { required: true, message: 'Vui lòng nhập số điện thoại' },
                  ]}
               >
                  <Input placeholder='Nhập số điện thoại' />
               </Item>
               <Item
                  label='Ngày sinh'
                  name='birthDate'
                  colon={false}
                  rules={[
                     { required: true, message: 'Vui lòng nhập ngày sinh' },
                  ]}
               >
                  <DatePicker
                     format='DD/MM/YYYY'
                     placeholder='Chọn ngày sinh'
                  />
               </Item>
               <List name='addresses'>
                  {(fields, { add, remove }) => (
                     <>
                        <>
                           <Typography.Text>Địa chỉ</Typography.Text>
                           {fields.map(({ key, name, ...restField }, index) => (
                              <div
                                 key={key}
                                 style={{
                                    display: 'flex',
                                    marginBottom: '8px',
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
                                          handleCityChange(index, value)
                                       }
                                       allowClear
                                       value={selectedCity}
                                    >
                                       {Array.isArray(cities) &&
                                       cities.length > 0 ? (
                                          cities.map((city: IApiAddress) => (
                                             <Option
                                                key={city?.id}
                                                value={city?.id}
                                             >
                                                {city?.name ?? city?.name_en}
                                             </Option>
                                          ))
                                       ) : (
                                          <Option disabled>
                                             Không có thành phố nào
                                          </Option>
                                       )}
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
                                          handleDistrictChange(index, value)
                                       }
                                       value={selectedDistrict}
                                       allowClear
                                    >
                                       {Array.isArray(districts) &&
                                       districts.length > 0
                                          ? districts.map(
                                               (district: IApiAddress) => (
                                                  <Option
                                                     key={district?.id}
                                                     value={district?.id}
                                                  >
                                                     {district?.name ??
                                                        district?.name_en}
                                                  </Option>
                                               )
                                            )
                                          : []}
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
                                       onChange={handleWardChange}
                                       value={selectedWard}
                                       allowClear
                                    >
                                       {Array.isArray(wards) &&
                                          wards.length > 0 &&
                                          wards.map((ward: IApiAddress) => (
                                             <Option
                                                key={ward?.id}
                                                value={ward?.id}
                                             >
                                                {ward?.name ?? ward?.name_en}
                                             </Option>
                                          ))}
                                    </Select>
                                 </Item>
                                 {fields.length > 1 && (
                                    <Button
                                       onClick={() => remove(name)}
                                       type='link'
                                    >
                                       <CloseOutlined />
                                    </Button>
                                 )}
                              </div>
                           ))}
                           <Item>
                              <Button type='dashed' onClick={() => add()} block>
                                 + Thêm địa chỉ
                              </Button>
                           </Item>
                        </>
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
                  <Button type='text' htmlType='reset'>
                     Hủy bỏ
                  </Button>
                  <Button type='primary' htmlType='submit'>
                     Tạo mới
                  </Button>
               </Item>
            </Form>
         </div>
      </div>
   );
};

export default NewUser;
