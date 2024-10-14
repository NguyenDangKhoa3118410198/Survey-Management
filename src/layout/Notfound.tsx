import { Button, Flex, Result } from 'antd';
import { useNavigate } from 'react-router-dom';

const Notfound = () => {
  const navigate = useNavigate();
  return (
    <Flex align='center' justify='center' style={{ height: '100%' }}>
      <Result
        status='404'
        title='404'
        subTitle='Sorry, the page you visited does not exist.'
        extra={
          <Button type='primary' onClick={() => navigate('/')}>
            Back Home
          </Button>
        }
      />
    </Flex>
  );
};

export default Notfound;
