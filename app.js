const AdminBro = require('admin-bro')
const AdminBroExpress = require('@admin-bro/express')
const AdminBroMongoose = require('@admin-bro/mongoose')
const argon2 = require('argon2')
const hashPassword = require('@admin-bro/passwords')
const mongoose = require('mongoose')

AdminBro.registerAdapter(AdminBroMongoose)


const express = require('express')
const app = express()

// crianod modelos com o mongoose
const User = mongoose.model('User', {
    name: { type: String, required: true },
    email: { type: String, required: true, uniq: true },
    username: { type: String, required: true },
    userType: {
        type: String,
        enum: ['user', 'admin'],
        default: 'user'
    },
    password: { type: String, required: true }
});

const Category = mongoose.model('Category', { name: String, status: { type: String, enum: ['Active', 'Disabled'], default: 'Active' } })

const Product = mongoose.model('Product', {
    name: { type: String, required: true },
    description: { type: String, required: true },
    status: { type: String, enum: ['Active', 'Disabled'], default: 'Active' },
    price: { type: Number, required: true },
    category: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Category',
        required: true,
    },
})

// function de criação do projeto
const run = async () => {
    // conexão com o banco de dados
    await mongoose.connect("mongodb+srv://admin:admin@teste.dz4nf.mongodb.net/teste?retryWrites=true&w=majority", { useNewUrlParser: true, useUnifiedTopology: true })
    //grupos de navigation
    const contentNavigation = {
        name: 'Serviços',
        icon: 'Accessibility',
    }
    const createParent = {
        name: 'Create',
        icon: 'fa fa-coffee',
    }
    // options do menu/models  
    const AdminBroOptions = {
        // cada recouser é uma configuração para uma model
        resources: [
            {
                resource: User,
                options: {
                    parent: createParent,
                    // setando o grupo de navegacao
                    navigation: contentNavigation,
                    //setando as propriedades customizdas da model
                    properties: {
                        //setando as configuracao do atributo
                        password: {
                            isVisible: { edit: true, list: false, show: false, filter: false },
                        },
                        name: {
                            isVisible: { edit: true, list: true, show: true, filter: false },
                        },
                        _id: {
                            isVisible: { edit: false, list: false, show: true, filter: false },
                        }
                    },
                },
                // setando configuracao de um atributo senha
                features: [hashPassword({
                    properties: {
                        encryptedPassword: 'password',
                        password: 'password'
                    },
                    hash: argon2.hash,
                })]
            },
            {
                resource: Category,
                options: {
                    navigation: contentNavigation,
                    properties: {
                        _id: {
                            isVisible: { edit: false, list: false, show: true, filter: false },
                        },
                    },
                },
            },

            {
                resource: Product,
                options: {
                    navigation: contentNavigation,
                    properties: {
                        price: {
                            isVisible: { edit: true, list: true, show: true, filter: false },
                        },
                        description: {
                            isVisible: { edit: true, list: false, show: true, filter: false },
                            type: "richtext"
                        },
                        _id: {
                            isVisible: { edit: false, list: false, show: true, filter: false },
                        },
                    },
                },
            },
        ],

        branding: {
            // title do projeto
            companyName: 'Dashboard Teste I - Nextti',
        },
        locale: {
            translations: {
                // setando  names das actions
                actions: {
                    new: 'Novo',
                    edit: 'Editar',
                    delete: 'Excluir',
                    show: 'Detalhes'
                },
                //setanod names do buttons
                buttons: {
                    save: 'Salvar',
                },
                // setando labels do menu
                labels: {
                    User: 'Usuários',
                    Category: 'Categorias',
                    Product: 'Produtos'
                }
            }
        },
        //setando component dashboard
        dashboard: {
            handler: async () => {
                return { user: 'Leonardo Mauricio' }
            },
            component: AdminBro.bundle('./dashboard')
        },
        //path padrão
        rootPath: '/admin',
    }

    // passando as options para o AdminBrow e crindo um objeto
    const adminBro = new AdminBro(AdminBroOptions)
    const router = AdminBroExpress.buildRouter(adminBro)

    app.use(adminBro.options.rootPath, router)
    app.listen(3000, () => console.log('AdminBro is under localhost:3000/admin'))
}

run()
