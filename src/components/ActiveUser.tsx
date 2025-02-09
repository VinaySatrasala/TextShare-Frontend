import { User } from "../types/types";

export const ActiveUsers : React.FC<User>= ({id,name}) => {
    return(
        <div>
            {id}
            {name}
        </div>
    )

}