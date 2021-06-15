import {QueryClient, QueryClientProvider} from "react-query";
import {wrapper} from "../store/configureStore";
import "../styles/globals.css";
import {ReactQueryDevtools} from 'react-query/devtools'


const queryClient = new QueryClient();

function MyApp({Component, pageProps}) {
    return (
        <QueryClientProvider client={queryClient}>
            <Component {...pageProps} />
            <ReactQueryDevtools initialIsOpen={false}/>
        </QueryClientProvider>
    );
}

export default wrapper.withRedux(MyApp);
