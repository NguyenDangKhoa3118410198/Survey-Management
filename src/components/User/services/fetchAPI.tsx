import useUser from 'hooks/useUser';

export const fetchCities = async () => {
  const data = await fetch('https://esgoo.net/api-tinhthanh/1/0.htm').then(
    (res) => res.json()
  );
  return data.data;
};

export const fetchDistricts = async (cityId: string) => {
  const city = cityId.split('-')[0];

  const data = await fetch(
    ` https://esgoo.net/api-tinhthanh/2/${city}.htm`
  ).then((res) => res.json());
  return data.data;
};

export const fetchWards = async (districtId: string) => {
  const district = districtId.split('-')[0];

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