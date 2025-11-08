import { Breadcrumb } from "react-bootstrap"
import { UserCard } from "../components/Account/UserCard/UserCard"
import { AddressCard } from "../components/Account/AddressCard/AddressCard"
import { Link } from "react-router-dom"
import { PurchaseCard } from "../components/Account/PurchaseCard/PurchaseCard"

export const Account = () => {
    
    return(
        <div className="container mt-4">
            <Breadcrumb className="breadcrum-principal text-decoration-none">
                <Breadcrumb.Item linkAs={Link} linkProps={{to:"/"}}>
                    Inicio
                </Breadcrumb.Item>
                <Breadcrumb.Item active>
                    Mi cuenta
                </Breadcrumb.Item>
            </Breadcrumb>

            <h1 className="text-center my-4">MI CUENTA</h1>
            
            <div className="row mb-5">
                
                <div className="col-md-5 mb-5">
                    <UserCard/>
                    <div className="mb-4"/> 
                    <AddressCard/>
                </div>


                <div className="col-md-7 mb-10">
                    <PurchaseCard/>
                </div>
            </div>

        </div>
    )
}