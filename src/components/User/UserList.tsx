import React, { useEffect, useState } from 'react';
import {
  Button,
  Card,
  Col,
  Input,
  Row,
  Select,
  Space,
  Table,
  Typography,
} from 'antd';
import { columns } from 'data/columnsUserList';
import { useNavigate } from 'react-router-dom';
import useUser from 'hooks/useUser';
import {
  CaretDownOutlined,
  CaretUpOutlined,
  PlusOutlined,
  SearchOutlined,
} from '@ant-design/icons';
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
  const [selectedWard, setWard] = useState('');

  const [isExpanded, setIsExpanded] = useState(true);

  const toggleExpand = () => {
    setIsExpanded((prev) => !prev);
  };

  const handleCreateUser = () => {
    navigate('/users/create');
  };

  useEffect(() => {
    const newParams = new URLSearchParams(searchParams.toString());

    if (!searchParams.get('city')) {
      newParams.delete('district');
      newParams.delete('ward');
      setDistrict('');
      setWard('');
    }

    if (!searchParams.get('district')) {
      newParams.delete('ward');
    }

    setSearchParams(newParams);
  }, [selectedCity, selectedDistrict, searchParams]);

  useEffect(() => {
    const cityId = searchParams.get('city') || '';
    const districtId = searchParams.get('district') || '';
    const wardId = searchParams.get('ward') || '';

    if (cityId) {
      setCity(cityId);
    }

    if (districtId) {
      setDistrict(districtId);
    }

    if (wardId) {
      setWard(wardId);
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
    queryKey: ['wardVN', selectedDistrict],
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
      <Card
        title='Bộ lọc'
        style={{ marginBottom: 30 }}
        extra={
          <p
            onClick={toggleExpand}
            style={{
              cursor: 'pointer',
              color: 'var(--main-color)',
              display: 'flex',
              alignItems: 'center',
            }}
          >
            {isExpanded ? (
              <>
                <CaretUpOutlined style={{ marginRight: 8 }} />
                Thu nhỏ
              </>
            ) : (
              <>
                <CaretDownOutlined style={{ marginRight: 8 }} />
                Mở rộng
              </>
            )}
          </p>
        }
      >
        {isExpanded ? (
          <>
            <Space direction='vertical' size='middle' style={{ width: '100%' }}>
              <Row gutter={[20, 20]} wrap>
                <Col xs={24} sm={12} md={8} lg={6}>
                  <Input
                    style={{ width: '100%' }}
                    type='text'
                    value={searchParams.get('id') || ''}
                    onChange={(e) =>
                      handleKeyValueFilterChange('id', e.target.value)
                    }
                    placeholder='ID'
                    allowClear
                  />
                </Col>
                <Col xs={24} sm={12} md={8} lg={6}>
                  <Input
                    style={{ width: '100%' }}
                    type='text'
                    value={searchParams.get('fullName') || ''}
                    onChange={(e) =>
                      handleKeyValueFilterChange('fullName', e.target.value)
                    }
                    placeholder='Name'
                    allowClear
                  />
                </Col>
                <Col xs={24} sm={12} md={8} lg={6}>
                  <Input
                    style={{ width: '100%' }}
                    type='email'
                    value={searchParams.get('email') || ''}
                    onChange={(e) =>
                      handleKeyValueFilterChange('email', e.target.value)
                    }
                    placeholder='Email'
                    allowClear
                  />
                </Col>
                <Col xs={24} sm={12} md={8} lg={6}>
                  <Select
                    style={{ width: '100%' }}
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
                </Col>
                <Col xs={24} sm={12} md={8} lg={6}>
                  <Select
                    style={{ width: '100%' }}
                    className='select-custom'
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
                      setDistrict('');
                      setWard('');
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
                </Col>
                <Col xs={24} sm={12} md={8} lg={6}>
                  <Select
                    style={{ width: '100%' }}
                    className='select-custom'
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
                      setWard('');
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
                </Col>
                <Col xs={24} sm={12} md={8} lg={6}>
                  <Select
                    style={{ width: '100%' }}
                    className='select-custom'
                    showSearch
                    placeholder='Chọn phường xã'
                    allowClear
                    optionFilterProp='label'
                    filterSort={(optionA, optionB) =>
                      (optionA?.label ?? '')
                        .toLowerCase()
                        .localeCompare((optionB?.label ?? '').toLowerCase())
                    }
                    value={selectedWard}
                    onChange={(value: any) => {
                      handleKeyValueFilterChange('ward', value);
                      setWard(value);
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
                </Col>
              </Row>
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
          </>
        ) : null}
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
