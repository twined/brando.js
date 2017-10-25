import { DashboardView } from '../../views/dashboard'
import { LoginView } from '../../views/auth'
import {
  ProfileView,
  UsersCreateView,
  UsersEditView,
  UsersListView
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

const dashboardRoutes = [
  {
    path: '/',
    component: DashboardView,
    name: 'dashboard',
    meta: { title: 'DASHBORD VIEW' }
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
    component: UsersListView,
    name: 'users',
    meta: { title: 'Brukere' }
  },

  {
    path: '/brukere/ny',
    component: UsersCreateView,
    name: 'users-create',
    meta: { title: 'Opprett ny bruker' }
  },

  {
    path: '/brukere/endre/:userId(\\d+)',
    component: UsersEditView,
    name: 'users-edit',
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
  dashboardRoutes,
  imagesRoutes,
  userRoutes
)
