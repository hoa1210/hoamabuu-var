import app from 'flarum/forum/app';
import StatementPage from './components/StatementPage';

app.initializers.add('hoa1210/hoamabu', () => {
  app.routes.statementPage = {
    path: '/sao-ke-tien-ung-ho-bao-yagi',
    component: StatementPage,
  };
});
