import { CloseOutlined } from '@ant-design/icons';
import { Button, Divider, Form, Input, Select } from 'antd';
import React from 'react';
const { Item } = Form;

interface AddressFormItemProps {
  itemKey: number;
  restField: any;
  handleRemoveAddress: (remove: (index: number) => void, name: number) => void;
  name: number;
  handleCityChange: (value: string, index: number) => void;
  handleDistrictChange: (value: string, index: number) => void;
  handleWardChange: (value: string, index: number) => void;
  index: number;
  cities: any[];
  districts: any[];
  wards: any[];
  userDetail?: any;
  fields: { name: number }[];
  selectedCity: string[];
  selectedDistrict: string[];
  remove: (index: number) => void;
  form: any;
  handleChangeAddressNumber: any;
  userStatus: string | undefined;
}

const AddressFormItem: React.FC<AddressFormItemProps> = ({
  itemKey,
  restField,
  handleRemoveAddress,
  name,
  handleCityChange,
  handleDistrictChange,
  handleWardChange,
  index,
  cities,
  districts,
  wards,
  userDetail,
  fields,
  selectedCity,
  selectedDistrict,
  remove,
  form,
  handleChangeAddressNumber,
  userStatus,
}) => {
  const validateUniqueAddress = (message: string) => (_: any, value: any) => {
    const allAddresses = form.getFieldValue('addresses') || [];
    const currentAddress = form.getFieldValue(['addresses', index]);

    if (
      !currentAddress?.addressNumber ||
      !currentAddress?.city ||
      !currentAddress?.district ||
      !currentAddress?.ward
    ) {
      return Promise.resolve();
    }

    const isDuplicate = allAddresses.some((addr: any, idx: number) => {
      return (
        idx !== index &&
        addr.addressNumber === currentAddress.addressNumber &&
        addr.city === currentAddress.city &&
        addr.district === currentAddress.district &&
        addr.ward === currentAddress.ward
      );
    });

    if (isDuplicate) {
      return Promise.reject(new Error(message));
    }

    return Promise.resolve();
  };

  return (
    <>
      <div
        key={itemKey}
        style={{
          display: 'flex',
          gap: '20px',
          width: '100%',
          margin: '0 0 24px 0',
        }}
      >
        <Item
          {...restField}
          name={[name, 'addressNumber']}
          style={{ flex: 1 }}
          layout='vertical'
          label='Số nhà'
          rules={[
            {
              required: true,
              message: 'Vui lòng nhập số nhà',
            },
            {
              validator: validateUniqueAddress('Địa chỉ bị trùng lặp'),
            },
          ]}
        >
          <Input
            className='radius'
            placeholder='Nhập địa chỉ'
            allowClear
            onChange={(e) => handleChangeAddressNumber(e.target.value, index)}
          />
        </Item>
        <Item
          {...restField}
          name={[name, 'city']}
          style={{ flex: 1, height: '52px' }}
          rules={[
            {
              required: true,
              message: 'Vui lòng chọn thành phố',
            },
            {
              validator: validateUniqueAddress('Địa chỉ bị trùng lặp'),
            },
          ]}
          layout='vertical'
          label='Thành phố'
        >
          <Select
            showSearch
            placeholder='Chọn thành phố'
            onChange={(value) => handleCityChange(value, index)}
            allowClear
            optionFilterProp='label'
            filterSort={(optionA, optionB) =>
              (optionA?.label ?? '')
                .toLowerCase()
                .localeCompare((optionB?.label ?? '').toLowerCase())
            }
            options={
              Array.isArray(cities) && cities.length > 0
                ? cities.map((city) => ({
                    label: city?.full_name,
                    value: city?.id,
                  }))
                : []
            }
            disabled={userDetail && userStatus !== 'Tạm ngưng'}
            onBlur={() => form.validateFields([['addresses', index, 'city']])}
          />
        </Item>
        <Item
          {...restField}
          name={[name, 'district']}
          style={{ flex: 1, height: '52px' }}
          rules={[
            {
              required: true,
              message: 'Vui lòng chọn quận/huyện',
            },
            {
              validator: validateUniqueAddress('Địa chỉ bị trùng lặp'),
            },
          ]}
          dependencies={[['addresses', name, 'city']]}
          layout='vertical'
          label='Quận huyện'
        >
          <Select
            showSearch
            placeholder='Chọn quận/huyện'
            onChange={(value) => handleDistrictChange(value, index)}
            disabled={
              (!userDetail && !selectedCity[index]) ||
              !form.getFieldValue(['addresses', index, 'city']) ||
              (userDetail && userStatus !== 'Tạm ngưng')
            }
            allowClear
            optionFilterProp='label'
            options={
              Array.isArray(districts) && districts[index]
                ? districts[index].map((district: any) => ({
                    label: district?.full_name,
                    value: district?.id,
                  }))
                : []
            }
            onBlur={() =>
              form.validateFields([['addresses', index, 'district']])
            }
          />
        </Item>
        <Item
          {...restField}
          name={[name, 'ward']}
          style={{ flex: 1, height: '52px' }}
          rules={[
            {
              required: true,
              message: 'Vui lòng chọn phường/xã!',
            },
            {
              validator: validateUniqueAddress('Địa chỉ bị trùng lặp'),
            },
          ]}
          dependencies={[
            ['addresses', name, 'city'],
            ['addresses', name, 'district'],
          ]}
          layout='vertical'
          label='Phường xã'
        >
          <Select
            showSearch
            placeholder='Chọn phường/xã'
            onChange={(value) => handleWardChange(value, index)}
            allowClear
            disabled={
              (!userDetail && !selectedDistrict[index]) ||
              !form.getFieldValue(['addresses', index, 'district']) ||
              (userDetail && userStatus !== 'Tạm ngưng')
            }
            optionFilterProp='label'
            options={
              Array.isArray(wards) && wards[index]
                ? wards[index]?.map((ward: any) => ({
                    label: ward?.full_name,
                    value: ward?.id,
                  }))
                : []
            }
            onBlur={() => form.validateFields([['addresses', index, 'ward']])}
          />
        </Item>
        {fields.length > 1 && (
          <Button onClick={() => handleRemoveAddress(remove, name)} type='link'>
            <CloseOutlined style={{ color: 'red' }} />
          </Button>
        )}
      </div>
      {fields.length > 1 && name !== fields.length - 1 && (
        <Divider style={{ marginBottom: '15px' }} />
      )}
    </>
  );
};

export default AddressFormItem;
