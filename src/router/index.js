import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import GeneratorView from '../views/GeneratorView.vue'
import SourcesView from '../views/SourcesView.vue'
import ConverterView from '../views/ConverterView.vue'
import AppsView from '../views/AppsView.vue'
import ContactsView from '../views/ContactsView.vue'
import JsonSchemaConstructor from '../views/JsonSchemaConstructor.vue'

const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes: [
        {
            path: '/',
            name: 'home',
            component: HomeView
        },
        {
            path: '/generator',
            name: 'generator',
            component: GeneratorView
        },
        {
            path: '/sources',
            name: 'sources',
            component: SourcesView
        },
        {
            path: '/converter',
            name: 'converter',
            component: ConverterView
        },
        {
            path: '/apps',
            name: 'apps',
            component: AppsView
        },
        {
            path: '/contacts',
            name: 'contacts',
            component: ContactsView
        },
        {
            path: '/schema-constructor',
            name: 'SchemaConstructor',
            component: JsonSchemaConstructor,
            meta: {
                title: 'Конструктор Schema'
            }
        }


    ]
})

export default router