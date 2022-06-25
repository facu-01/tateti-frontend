import { Bar } from 'pages/home/Bar';
import { Outlet } from 'react-router-dom';
import { Table } from 'pages/home/subPages/Table';

export const Home: React.FC = () => {
  // TODO: browse games

  return (
    <div
      style={{
        width: '100%',
        height: '100%',
        display: 'grid',
        gridTemplateRows: '50px calc(100% - 50px)',
        gridTemplateColumns: '50% 50%',
        padding: '10px',
        paddingBottom: '20px',
        rowGap: '10px',
        columnGap: '10px',
      }}
    >
      <div
        style={{
          gridColumn: '1 / -1',
        }}
      >
        <Bar />
      </div>
      <div
        style={{
          gridColumn: '2',
          gridRow: '2',
        }}
      >
        <Table />
      </div>
      <Outlet />
    </div>
  );
};
