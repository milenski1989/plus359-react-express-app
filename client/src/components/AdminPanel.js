import React from 'react'
import Navbar from './Navbar'
import TabsWrapper from './Tabs'
import StoragesManagement from './StoragesManagement'
import UsersManagement from './UsersManagement'
function AdminPanel() {
     
    return <>
        <Navbar />
        <TabsWrapper 
            labels={['Storages', 'Users']}
            components={[StoragesManagement, UsersManagement]}
        /> 
    </>
    
}

export default AdminPanel