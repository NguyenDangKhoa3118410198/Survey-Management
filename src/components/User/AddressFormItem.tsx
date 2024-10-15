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
}) => {
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
          style={{ flex: 1, height: '52px' }}
          layout='vertical'
          label='Số nhà'
          rules={[
            {
              required: true,
              message: 'Vui lòng nhập số nhà',
            },
          ]}
        >
          <Input className='radius' placeholder='Nhập địa chỉ' allowClear />
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
              !form.getFieldValue(['addresses', index, 'city'])
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
              !form.getFieldValue(['addresses', index, 'district'])
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
          />
        </Item>
        {fields.length > 1 && (
          <Button onClick={() => handleRemoveAddress(remove, name)} type='link'>
            <CloseOutlined style={{ color: 'red' }} />
          </Button>
        )}
      </div>
      {fields.length > 1 && name !== fields.length - 1 && (
        <Divider style={{ marginBottom: '10px' }} />
      )}
    </>
  );
};

export default AddressFormItem;
