import { Link } from "react-router-dom";

export default function NotFound(){
    return (
        <>
            <h1 className="font-black text-center text-7xl text-white mb-10">ERROR 404</h1>
            <h2 className="font-black text-center text-4xl text-white">No se encontró la página</h2>
            <p className="mt-10 text-center text-white">
                Quzás quieras ir a {' '}
                <Link className='text-fuchsia-500' to={'/'}>Mis proyectos</Link>
            </p>
        </>
    )
}