import { NbMenuItem } from '@nebular/theme';
import { TaskFilter, TaskFilterEnum } from 'app/models/Task';

export const MENU_ITEMS: NbMenuItem[] = [
  {
    title: 'PRINCIPAL',
    group: true,
  },
  {
    title: 'Dashboard',
    icon: 'home-outline',
    link: '/pages/dash',
    home: true,
  }, {
    title: 'CADASTROS',
    group: true,
  },
  {
    title: 'Usuarios',
    icon: 'person-outline',
    link: '/pages/user',
  },
  {
    title: 'Tarefas',
    icon: 'checkmark-square-outline',
    children: [
      new TaskFilter('Minhas', TaskFilterEnum.MY),
      new TaskFilter('Em aberto', TaskFilterEnum.OPENED),
      new TaskFilter('Finalizadas', TaskFilterEnum.FINISHED),
      new TaskFilter('Todos', TaskFilterEnum.ALL),
    ],
  },

];
