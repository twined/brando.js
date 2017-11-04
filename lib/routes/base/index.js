import { LoginView } from '../../views/auth'
import {
  ProfileView,
  UserCreateView,
  UserEditView,
  UserListView
} from '../../views/users'

import {
  ImageCategoryView,
  ImageCategoryListView,
  ImageCategoryDetailView
} from '../../views/images'

import {
  PageListView,
  PageCreateView,
  PageEditView
} from '../../views/pages'

import {
  PageFragmentListView,
  PageFragmentCreateView,
  PageFragmentEditView
} from '../../views/pageFragments'

const authRoutes = [
  {
    path: '/login',
    component: LoginView,
    name: 'login',
    meta: { title: 'Login', noAuth: true }
  }
]

const pageRoutes = [
  {
    path: '/sider',
    component: PageListView,
    name: 'pages',
    meta: { title: 'Sider' }
  },
  {
    path: '/side/ny',
    component: PageCreateView,
    name: 'page-create',
    meta: { title: 'Ny side' }
  },
  {
    path: '/side/endre/:pageId',
    component: PageEditView,
    name: 'page-edit',
    meta: { title: 'Endre side' },
    props: true
  }
]

const pageFragmentRoutes = [
  {
    path: '/sidefragmenter',
    component: PageFragmentListView,
    name: 'pagefragments',
    meta: { title: 'Sider' }
  },
  {
    path: '/sidefragment/ny',
    component: PageFragmentCreateView,
    name: 'pagefragment-create',
    meta: { title: 'Ny side' }
  },
  {
    path: '/sidefragment/endre/:pageId',
    component: PageFragmentEditView,
    name: 'pagefragment-edit',
    meta: { title: 'Endre side' },
    props: true
  }
]

const userRoutes = [
  {
    path: '/profil',
    component: ProfileView,
    name: 'profile',
    meta: { title: 'Min profil' }
  },

  {
    path: '/brukere',
    component: UserListView,
    name: 'users',
    meta: { title: 'Brukere' }
  },

  {
    path: '/brukere/ny',
    component: UserCreateView,
    name: 'user-create',
    meta: { title: 'Opprett ny bruker' }
  },

  {
    path: '/brukere/endre/:userId',
    component: UserEditView,
    name: 'user-edit',
    meta: { title: 'Endre bruker' },
    props: true
  }
]

const imagesRoutes = [
  {
    path: '/bilder',
    component: ImageCategoryView,
    meta: { title: 'Bildeoversikt' },
    props: true,
    children: [
      { path: '', component: ImageCategoryListView, name: 'images', meta: { title: 'Bildeoversikt' }, props: true },
      { path: 'kategori/:categoryId', component: ImageCategoryDetailView, name: 'image-category-detail', meta: { title: 'Vis kategori' }, props: true }
    ]
  }
]

export default [].concat(
  authRoutes,
  imagesRoutes,
  pageRoutes,
  pageFragmentRoutes,
  userRoutes
)
