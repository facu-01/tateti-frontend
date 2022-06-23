import { Bar } from 'pages/home/Bar';
import { Outlet } from 'react-router-dom';

export const Home: React.FC = () => {
  // TODO: browse games

  return (
    <div
      style={{
        width: '100%',
        height: '100%',
        display: 'grid',
        gridTemplateRows: '50px auto',
        gridTemplateColumns: '50% 50%',
        padding: '10px',
        paddingBottom: '20px',
      }}
    >
      <div
        style={{
          gridColumn: '1 / -1',
        }}
      >
        <Bar />
      </div>
      <Outlet />
    </div>
  );
};
