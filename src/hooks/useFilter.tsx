import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import debounce from 'lodash/debounce';

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

  const applyKeyValueFilter = (data: T[]) => {
    let filtered = [...data];
    searchParams.forEach((value, key) => {
      filtered = filtered.filter((item) =>
        String(item[key as keyof T])
          ?.toLowerCase()
          .includes(value.toLowerCase())
      );
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
  };
};

export default useFilter;
