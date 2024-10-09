import useUser from 'hooks/useUser';

export const fetchCities = async () => {
  const data = await fetch('https://esgoo.net/api-tinhthanh/1/0.htm').then(
    (res) => res.json()
  );
  return data.data;
};

export const fetchDistricts = async (cityId: string) => {
  const city = cityId.includes('_') ? cityId.split('_')[0] : cityId;

  const data = await fetch(
    ` https://esgoo.net/api-tinhthanh/2/${city}.htm`
  ).then((res) => res.json());
  return data.data;
};

export const fetchWards = async (districtId: string) => {
  const district = districtId.includes('_')
    ? districtId.split('_')[0]
    : districtId;

  const data = await fetch(
    `https://esgoo.net/api-tinhthanh/3/${district}.htm`
  ).then((res) => res.json());
  return data.data;
};

export const fetchUserbyId = (userId: string) => {
  const { userList } = useUser.getState();

  const user = userList.find((user) => user.id === Number(userId));

  return user;
};
