

function ResetPassword(){
    return (
        <div>
        <h1> Reset Password </h1>
        <form>
            <div class="form-group"> 
                <label for="new-password">New Password</label>
                <input type="form-control" id="new-password" placeholder="Enter new password"></input>
            </div>

            <div class="form-group"> 
                <label for="confirm-new-password">Confirm New Password</label>
                <input type="form-control" id="confirm-new-password" placeholder="Confirm new password"></input>
            </div>
            
            <button type="submit">Save Changes</button>
            
        </form>
        
        </div>
    )




}

export default ResetPassword

