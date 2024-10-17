import React, { useEffect, useState } from 'react';
import {
  Button,
  Card,
  Flex,
  Input,
  Select,
  Space,
  Table,
  Typography,
} from 'antd';
import { columns } from 'data/columnsUserList';
import { useNavigate } from 'react-router-dom';
import useUser from 'hooks/useUser';
import { PlusOutlined, SearchOutlined } from '@ant-design/icons';
import useFilter from 'hooks/useFilter';
import { useQuery } from '@tanstack/react-query';
import { fetchCities, fetchDistricts, fetchWards } from './services/fetchAPI';

const { Option } = Select;

const UserList: React.FC = () => {
  const navigate = useNavigate();
  const { userList } = useUser();
  const {
    filteredData,
    handleKeyValueFilterChange,
    handleAllFilterChange,
    searchParams,
    setSearchParams,
  } = useFilter({
    initialData: userList,
  });

  const [selectedCity, setCity] = useState('');
  const [selectedDistrict, setDistrict] = useState('');

  const handleCreateUser = () => {
    navigate('/users/create');
  };

  useEffect(() => {
    const newParams = new URLSearchParams(searchParams.toString());

    if (!searchParams.get('city')) {
      newParams.delete('district');
      newParams.delete('ward');
    }

    if (!searchParams.get('district')) {
      newParams.delete('ward');
    }

    setSearchParams(newParams);
  }, [selectedCity, selectedDistrict, searchParams]);

  useEffect(() => {
    const cityId = searchParams.get('city') || '';
    const districtId = searchParams.get('district') || '';

    if (cityId) {
      setCity(cityId);
    }
    if (districtId) {
      setDistrict(districtId);
    }
  }, [searchParams]);

  const { data: cities } = useQuery({
    queryKey: ['cityVN'],
    queryFn: fetchCities,
  });

  const { data: districts } = useQuery({
    queryKey: ['districtVN', selectedCity],
    queryFn: () => fetchDistricts(selectedCity),
    enabled: !!selectedCity,
  });

  const { data: wards } = useQuery({
    queryKey: ['wardVN'],
    queryFn: () => fetchWards(selectedDistrict),
    enabled: !!selectedDistrict,
  });
  const clearFilters = () => {
    const newParams = new URLSearchParams();
    setSearchParams(newParams);
    setCity('');
    setDistrict('');
  };

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        height: 'calc(100vh - 150px)',
      }}
    >
      <Card title='Bộ lọc' style={{ marginBottom: 30 }}>
        <Space direction='vertical' size='middle' style={{ width: '100%' }}>
          <Flex wrap gap={20}>
            <Input
              style={{ width: 200 }}
              type='text'
              value={searchParams.get('id') || ''}
              onChange={(e) => handleKeyValueFilterChange('id', e.target.value)}
              placeholder='ID'
              allowClear
            />
            <Input
              style={{ width: 200 }}
              type='text'
              value={searchParams.get('fullName') || ''}
              onChange={(e) =>
                handleKeyValueFilterChange('fullName', e.target.value)
              }
              placeholder='Name'
              allowClear
            />
            <Input
              style={{ width: 200 }}
              type='email'
              value={searchParams.get('email') || ''}
              onChange={(e) =>
                handleKeyValueFilterChange('email', e.target.value)
              }
              placeholder='Email'
              allowClear
            />
            <Select
              style={{ width: 200, borderRadius: '0px !important' }}
              className='filterSelect'
              value={searchParams.get('gender') || ''}
              onChange={(value: any) =>
                handleKeyValueFilterChange('gender', value)
              }
            >
              <Option value=''>Select Gender</Option>
              <Option value='Nam'>Nam</Option>
              <Option value='Nữ'>Nữ</Option>
              <Option value='Khác'>Khác</Option>
            </Select>
            <Space>
              <Select
                style={{ width: 200 }}
                showSearch
                placeholder='Chọn thành phố'
                allowClear
                optionFilterProp='label'
                filterSort={(optionA, optionB) =>
                  (optionA?.label ?? '')
                    .toLowerCase()
                    .localeCompare((optionB?.label ?? '').toLowerCase())
                }
                value={searchParams.get('city') || ''}
                onChange={(value: any) => {
                  setCity(value);
                  handleKeyValueFilterChange('city', value);
                }}
                options={
                  Array.isArray(cities) && cities.length > 0
                    ? cities.map((city) => ({
                        label: city?.full_name,
                        value: city?.id,
                      }))
                    : []
                }
              />
              <Select
                style={{ width: 200 }}
                showSearch
                placeholder='Chọn quận huyện'
                allowClear
                optionFilterProp='label'
                filterSort={(optionA, optionB) =>
                  (optionA?.label ?? '')
                    .toLowerCase()
                    .localeCompare((optionB?.label ?? '').toLowerCase())
                }
                value={selectedDistrict}
                onChange={(value: any) => {
                  handleKeyValueFilterChange('district', value);
                  setDistrict(value);
                }}
                disabled={!selectedCity}
                options={
                  Array.isArray(districts) && districts.length > 0
                    ? districts.map((district) => ({
                        label: district?.full_name,
                        value: district?.id,
                      }))
                    : []
                }
              />
              <Select
                style={{ width: 200 }}
                showSearch
                placeholder='Chọn phường xã'
                allowClear
                optionFilterProp='label'
                filterSort={(optionA, optionB) =>
                  (optionA?.label ?? '')
                    .toLowerCase()
                    .localeCompare((optionB?.label ?? '').toLowerCase())
                }
                value={searchParams.get('ward') || ''}
                onChange={(value: any) => {
                  handleKeyValueFilterChange('ward', value);
                  setDistrict(value);
                }}
                disabled={!selectedCity || !selectedDistrict}
                options={
                  Array.isArray(wards) && wards.length > 0
                    ? wards.map((ward) => ({
                        label: ward?.full_name,
                        value: ward?.id,
                      }))
                    : []
                }
              />
            </Space>
          </Flex>
        </Space>
        <Button
          type='default'
          onClick={clearFilters}
          style={{
            width: 100,
            display: 'flex',
            marginLeft: 'auto',
            backgroundColor: 'var(--main-color)',
            color: '#fff',
          }}
        >
          Xóa bộ lọc
        </Button>
      </Card>
      <div
        style={{
          backgroundColor: '#fff',
          padding: '4px 12px',
          height: '100%',
        }}
      >
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            margin: '10px 0',
          }}
        >
          <Typography.Title level={4} style={{ margin: 0 }}>
            Danh sách người dùng
          </Typography.Title>
          <Space>
            <Input
              prefix={<SearchOutlined />}
              placeholder='Nhập từ khóa tìm kiếm'
              allowClear
              onChange={(e) => handleAllFilterChange(e.target.value)}
              style={{
                width: 200,
                marginRight: '12px',
                borderRadius: '14px',
              }}
            />
            <Button
              style={{
                backgroundColor: 'var(--main-color)',
                color: '#fff',
                borderRadius: '20px',
              }}
              onClick={handleCreateUser}
              icon={<PlusOutlined />}
            >
              Tạo mới
            </Button>
          </Space>
        </div>

        <div
          style={{
            flex: 1,
            overflow: 'auto',
            margin: '18px 26px 18px 18px',
          }}
        >
          <Table
            rowKey='id'
            dataSource={filteredData ?? []}
            columns={columns}
            scroll={{ y: 'calc(100vh - 360px)', x: 'auto' }}
          />
        </div>
      </div>
    </div>
  );
};

export default UserList;
