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
  // Define a route for the StatementPage component
  app.routes.statementPage = {
    path: '/sao-ke-tien-ung-ho-bao-yagi',
    component: StatementPage,
  };

  // Extend IndexPage to add a link to the navigation items
  // extend(IndexPage.prototype, 'navItems', (items) => {
  //   items.add(
  //     'statementPage',
  //     <LinkButton href={app.route('statementPage')} icon="fas fa-magic">
  //       {'Sao kê bão Yagi'}
  //     </LinkButton>,
  //     100
  //   );
  // });

  // Extend UserCard to add a chat button
  extend(UserCard.prototype, 'infoItems', function (items) {
    const currentUserId = app.current?.data?.user?.data?.id;
    const userId = currentUserId || this.attrs.user.data.id;

    items.add(
      'chatButton',
      Button.component(
        {
          className: 'chat-button padding-btn-chat',
          onclick: () => {
            if (!userId) {
              console.error('User ID not available');
              return;
            }

            if (!app.session.user) {
              app.modal.show(LogInModal);
            } else if (typeof jqac?.arrowchat !== 'undefined') {
              jqac.arrowchat.chatWith(userId);
            } else {
              console.error('ArrowChat is not loaded or initialized');
            }
          },
        },
        [<i class="fas fa-comment-dots"></i>, <span style="margin-left: 5px;">Nhắn tin</span>]
      )
    );
  });

  // Extend PostUser to add a chat button
  extend(PostUser.prototype, 'view', function (vnode) {
    const userId = this.attrs.post?.data?.relationships?.user?.data?.id;

    vnode.children.push(
      m(
        'button',
        {
          className: 'chat-button',
          onclick: () => {
            if (!userId) {
              console.error('User ID not available');
              return;
            }

            if (!app.session.user) {
              app.modal.show(LogInModal);
            } else if (typeof jqac?.arrowchat !== 'undefined') {
              jqac.arrowchat.chatWith(userId);
            } else {
              console.error('ArrowChat is not loaded or initialized');
            }
          },
          style: { marginLeft: '10px' },
        },
        [<i class="fas fa-comment-dots"></i>]
      )
    );
  });
});
