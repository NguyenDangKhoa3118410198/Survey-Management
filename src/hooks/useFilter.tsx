import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import debounce from 'lodash/debounce';
import dayjs from 'dayjs';

interface IUseFilterProps<T> {
  initialData: T[];
}

const useFilter = <T extends object>({ initialData }: IUseFilterProps<T>) => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [filteredData, setFilteredData] = useState<T[]>(initialData);
  const [allFilter, setAllFilter] = useState('');

  const debouncedSetAllFilter = debounce((value) => {
    setAllFilter(value);
  }, 300);

  const applyKeyValueFilter = (data: any[]) => {
    let filtered = [...data];

    const startDateValue = searchParams.get('startDate');
    const endDateValue = searchParams.get('endDate');

    const startDate = startDateValue
      ? dayjs(Number(decodeURIComponent(startDateValue)))
      : null;
    const endDate = endDateValue
      ? dayjs(Number(decodeURIComponent(endDateValue)))
      : null;

    filtered = filtered.filter((item) => {
      const itemStartDate = dayjs(item.startDate, 'DD/MM/YYYY');

      if (startDate && itemStartDate.isBefore(startDate)) {
        return false;
      }

      if (endDate && itemStartDate.isAfter(endDate)) {
        return false;
      }

      return true;
    });

    searchParams.forEach((value, key) => {
      if (key !== 'startDate' && key !== 'endDate') {
        filtered = filtered.filter((item) => {
          const itemValue = String(item[key as keyof T]).toLowerCase();
          return itemValue.includes(value.toLowerCase());
        });
      }
    });

    return filtered;
  };

  const applyAllFilter = (data: T[]) => {
    if (!allFilter) return data;
    return data.filter((item) =>
      Object.values(item).some((value) =>
        String(value).toLowerCase().includes(allFilter.toLowerCase())
      )
    );
  };

  useEffect(() => {
    let result = applyKeyValueFilter(initialData);
    result = applyAllFilter(result);
    setFilteredData(result);
  }, [searchParams, allFilter, initialData]);

  const handleKeyValueFilterChange = (key: string, value: string) => {
    const newParams = new URLSearchParams(searchParams.toString());
    if (value) {
      newParams.set(key, value);
    } else {
      newParams.delete(key);
    }
    setSearchParams(newParams);
  };

  const handleAllFilterChange = (value: string) => {
    debouncedSetAllFilter(value);
  };

  return {
    filteredData,
    handleKeyValueFilterChange,
    handleAllFilterChange,
    searchParams,
    setSearchParams,
  };
};

export default useFilter;
