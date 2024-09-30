import { redirect } from "next/navigation";

export async function login(prevState: any, formData: FormData) {
    console.log(prevState,formData);
    redirect('/login')
}