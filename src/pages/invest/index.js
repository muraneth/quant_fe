import { useParams } from 'react-router-dom';

const InvestPage = () => {
  const { id } = useParams();
  return (
    <div>
      <h1>Invest Page {id}</h1>
    </div>
  );
};

export default InvestPage;
