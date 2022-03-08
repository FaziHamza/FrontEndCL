import {CoreMenu} from '@core/types'

export const menu: CoreMenu[] = [
    {
        id: 'home',
        title: 'Home',
        translate: 'MENU.HOME',
        type: 'item',
        icon: 'home',
        url: 'home'
    }, {
        id: 'profile',
        title: 'Profile',
        translate: 'MENU.PROFILE',
        type: 'item',
        icon: 'user',
        url: 'user/profile'
    },
    {
        id: 'timesheet',
        title: 'TimeSheet',
        translate: 'MENU.TIMESHEET',
        type: 'item',
        icon: 'clock',
        url: 'timesheet'
    },
    {
        id: 'common',
        title: 'Common',
        translate: 'MENU.COMMON',
        type: 'item',
        icon: 'grid',
        url: 'commons'
    },
    // {
    //     id: 'employee-contractor',
    //     title: 'Employee Contractor Wizard',
    //     translate: 'Employee Contractor Wizard',
    //     type: 'item',
    //     icon: 'user',
    //     url: 'user/initial-setup'
    // },
    {
        id: 'Meeting Room',
        title: 'Meeting Room',
        translate: 'Meeting Room',
        type: 'item',
        icon: 'users',
        url: 'pages/meeting-room'
    },
    {
        id: 'Organization',
        title: 'Organization',
        translate: 'Organization',
        type: 'item',
        icon: 'users',
        url: 'pages/org'
    },
    {
        id: 'Org Configuration',
        title: 'Org Configuration',
        translate: 'Org Configuration',
        type: 'item',
        icon: 'users',
        url: 'pages/org-config'
    },
    {
        id: 'JOB',
        title: 'JOB',
        translate: 'JOB',
        type: 'item',
        icon: 'users',
        url: 'pages/job'
    },
    {
        id: 'Invoice',
        title: 'Invoice',
        translate: 'Invoice',
        type: 'item',
        icon: 'users',
        url: 'pages/invoice'
    },
    {
        id: 'gp-template',
        title: 'General Page Templates',
        translate: 'MENU.GPT',
        type: 'item',
        icon: 'file',
        url: 'pages/gp-templates'
    },
    {
        id: 'invoice-sample',
        title: 'Invoice Sample',
        translate: 'MENU.INVOICE',
        type: 'item',
        icon: 'file',
        url: 'pages/invoice-sample'
    },
    {
        id: 'lookups',
        title: 'Lookups',
        translate: 'MENU.LOOKUPS',
        type: 'item',
        icon: 'file',
        url: 'admin/lookups'
    },
    {
        id: 'Project ',
        title: 'Project ',
        translate: 'Project',
        type: 'item',
        icon: 'users',
        url: 'pages/projects'
    },
    {
        id: 'Task',
        title: 'Task',
        translate: 'Task',
        type: 'item',
        icon: 'users',
        url: 'pages/task'
    },
    {
        id: 'Task Status',
        title: 'Task Status',
        translate: 'Task Status',
        type: 'item',
        icon: 'users',
        url: 'pages/taskstatus'
    },
    {
        id: 'Skill Category',
        title: 'Skill Category',
        translate: 'Skill Category',
        type: 'item',
        icon: 'users',
        url: 'pages/skillcatg'
    },
    {
        id: 'Skill',
        title: 'Skill',
        translate: 'Skill',
        type: 'item',
        icon: 'users',
        url: 'pages/skill'
    },
]
