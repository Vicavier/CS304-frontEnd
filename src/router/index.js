import {createRouter, createWebHistory} from "vue-router";

const routes = [
    //register and login
    {
        path: '/',
        component: () => import('../view/HomePage.vue'),
        children: [
            {
                path: '/',
                component: () => import('../view/mainpage/MainContent.vue')
            },
            {
                path: 'selfpage',
                component: () => import('../view/profile/ProfilePage.vue'),
            },
            {
                path: '/write',
                component: () => import('../view/WritePage.vue'),
                children: [
                    {
                        path: '',
                        component: () => import('../view/WriteAssey.vue'),
                    },
                    {
                        path: 'QA',
                        component: () => import ('../view/mainpage/QandA.vue'),
                    }
                ]
            },
            {
                path: '/secondhand',
                component: () => import('../view/SecondHand.vue')
            },
            {
                path: '/video',
                component: () => import('../view/VideoPage.vue'),
            },
            {
                path: '/playVideo/:id/:url/:uploader',
                name:'playVideo',
                component: () => import('../view/mainpage/VideoContent.vue'),
                props:true
            },
            {
                path: '/article/:id',
                name: 'article',
                component: () => import('../view/mainpage/EssayContent'),
                props: true
            },
            {
                path:'/upload',
                component:()=>import('../view/mainpage/UploadVideo.vue'),
            }

        ]
    },
    {
        path: '/edit',
        component: () => import('../view/profile/InfoEdit.vue')
    },
    {
        path: '/sign',
        component: () => import('../view/SignPage.vue'),
    },
    {
        path: '/answer/:title',
        name:'answer',
        component: () => import('../components/ansComponent.vue'),
    },

]

const router = createRouter({
    history: createWebHistory(),
    routes
})

export default router;