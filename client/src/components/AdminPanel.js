import React from 'react'
import TabsWrapper from './Tabs'
import StoragesManagement from './StoragesManagement'
import UsersManagement from './UsersManagement'
function AdminPanel() {
     
    return <>
        <TabsWrapper 
            labels={['Storages', 'Users']}
            components={[StoragesManagement, UsersManagement]}
        /> 
    </>
    
}

export default AdminPanel