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

const authRoutes = [
  {
    path: '/login',
    component: LoginView,
    name: 'login',
    meta: { title: 'Login', noAuth: true }
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
    path: '/brukere/endre/:userId(\\d+)',
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
  userRoutes
)
