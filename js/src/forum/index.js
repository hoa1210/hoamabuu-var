import app from 'flarum/forum/app';
import StatementPage from './components/StatementPage';
import LinkButton from 'flarum/components/LinkButton';
import { extend } from 'flarum/common/extend';
import IndexPage from 'flarum/components/IndexPage';
import UserCard from 'flarum/components/UserCard';
import Button from 'flarum/common/components/Button';

app.initializers.add('hoa1210/hoamabu', () => {
  app.routes.statementPage = {
    path: '/sao-ke-tien-ung-ho-bao-yagi',
    component: StatementPage,
  };

  extend(IndexPage.prototype, 'navItems', (items) => {
    items.add(
      'statementPage',
      <LinkButton href={app.route('statementPage')} icon="fas fa-magic">
        {'Sao kê bão Yagi'}
      </LinkButton>,
      100
    );
  });

  extend(UserCard.prototype, 'infoItems', function (items) {
    if (app.current && app.current.data && app.current.data.user) {
      items.add(
        'profileButton',
        Button.component(
          {
            className: 'chat-button',
            onclick: () => {
              const userId = app.current.data.user.data.id;
              if (userId) {
                if (typeof jqac !== 'undefined' && typeof jqac.arrowchat !== 'undefined') {
                  jqac.arrowchat.chatWith(userId);
                } else {
                  console.error('User ID not available');
                }
              } else {
                console.error('ArrowChat is not loaded or initialized');
              }
            },
          },
          [
            <i class="fas fa-comment-dots"></i>,
            <b>Nhắn tin</b>
          ]
        )
      );
    }
  });
});
