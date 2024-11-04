import { CaretDownOutlined, CaretUpOutlined } from '@ant-design/icons';
import { Card } from 'antd';
import React, { ReactNode, useState } from 'react';

interface FilterWrapperProps {
  children: ReactNode;
}

const FilterWrapper: React.FC<FilterWrapperProps> = ({ children }) => {
  const [isExpanded, setIsExpanded] = useState(true);

  const toggleExpand = () => {
    setIsExpanded((prev) => !prev);
  };

  return (
    <Card
      title={
        <p style={{ fontWeight: 700, textTransform: 'uppercase' }}>Bộ lọc</p>
      }
      className={`filter-container ${
        isExpanded ? 'filter-is-expand-expanded' : ''
      }`}
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
      {isExpanded ? <>{children}</> : null}
    </Card>
  );
};

export default FilterWrapper;
