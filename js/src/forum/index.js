import app from 'flarum/forum/app';
import StatementPage from './components/StatementPage';
import LinkButton from 'flarum/components/LinkButton';
import { extend } from 'flarum/common/extend';
import IndexPage from 'flarum/components/IndexPage';
import UserCard from 'flarum/components/UserCard';
import Button from 'flarum/common/components/Button';
import PostUser from 'flarum/components/PostUser';
import LogInModal from 'flarum/forum/components/LogInModal';

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
    const currentUser = app.current?.data?.user;

    items.add(
      'chatButton',
      Button.component(
        {
          className: 'chat-button',
          onclick: () => {
            if (!app.session.user) {
              app.modal.show(LogInModal);
            } else {
              const userId = currentUser.data.id;
              if (userId) {
                if (typeof jqac !== 'undefined' && typeof jqac.arrowchat !== 'undefined') {
                  jqac.arrowchat.chatWith(userId);
                } else {
                  console.error('ArrowChat is not loaded or initialized');
                }
              } else {
                console.error('User ID not available');
              }
            }
          },
        },
        [<i class="fas fa-comment-dots"></i>, <span>Nhắn tin</span>]
      )
    );
  });

  extend(PostUser.prototype, 'view', function (vnode) {
    const post = this.attrs.post;
    const userId = post?.data?.relationships?.user?.data?.id;

    vnode.children.push(
      m(
        'button',
        {
          className: 'chat-button',
          onclick: () => {
            if (!app.session.user) {
              app.modal.show(LogInModal);
            } else {
              if (typeof jqac !== 'undefined' && typeof jqac.arrowchat !== 'undefined') {
                jqac.arrowchat.chatWith(userId);
              } else {
                console.error('ArrowChat is not loaded or initialized');
              }
            }
          },
          style: { marginLeft: '10px' },
        },
        [<i class="fas fa-comment-dots"></i>]
      )
    );
  });
});
