import { useState, useEffect } from "react";
import { useParams, Link } from 'react-router-dom'
import clienteAxios from "../../config/clienteAxios";

//Components
import Alerta from "../../components/Alerta";

const NuevoPassword = () => {

    const [password, setPassword] = useState('')
    const [passwordModificado, setPasswordModificado] = useState(false)
    const [alerta, setAlerta] = useState({})
    const [tokenValido, setTokenValido] = useState(false)

    const params = useParams()
    const { token } = params

    useEffect(() => {
        const comprobarToken = async () => {
            try {
                await clienteAxios(`/usuarios/olvide-password/${token}`)

                setTokenValido(true)

            } catch (error) {
                setAlerta({
                    msg: error.response.data.msg,
                    error: true
                })
            }
        }

        comprobarToken()
    }, []);

    const handleSubmit = async e => {
        e.preventDefault()

        if (password.length < 6) {
            setAlerta({
                msg: 'La contraseña debe tener minimo 6 caracteres',
                error: true
            })
            return
        }

        try {

            const url = `/usuarios/olvide-password/${token}`
            const { data } = await clienteAxios.post(url, { password })

            setAlerta({
                msg: data.msg,
                error: false
            })

            setTokenValido(false)
            setPasswordModificado(true)

        } catch (error) {
            setAlerta({
                msg: error.response.data.msg,
                error: true
            })
        }

    }

    const { msg } = alerta

    return (
        <>
            <h1 className="text-sky-600 font-black text-6xl capitalize">
                Reestablece tu password y no pierdas acceso a tus{" "}
                <span className="text-slate-700">proyectos</span>
            </h1>

            {msg && <Alerta alerta={alerta} />}

            {tokenValido && (
                <form className="my-10 bg-white shadow rounded-lg p-10" onSubmit={handleSubmit}>
                    <div className="my-5">
                        <label htmlFor="password" className=" text-gray-600 block text-xl font-bold">Nuevo Password</label>
                        <input type="password" id="password" placeholder="Ingrese nuevo password" value={password} className="w-full mt-3 p-3 border rounded-xl bg-gray-50" onChange={e => setPassword(e.target.value)} />
                    </div>
                    <input type="submit" value="Guardar nuevo password" className="bg-sky-700 mb-5  text-white uppercase font-bold py-3 hover:cursor-pointer w-full rounded transition-colors hover:bg-sky-800" />
                </form>
            )}
            {passwordModificado && (
                <Link
                    to="/"
                    className="block text-center my-5 text-slate-500 text-sm uppercase"
                >
                    Inicia sesión
                </Link>
            )}

        </>
    )
}

export default NuevoPassword