import NavBar from "@/components/navbar";
import TestPageContent from "./components/content/content";

const TestPage: React.FC<{}> = () => {
    return (
        <div>
            <NavBar />
            <TestPageContent />
        </div>
    )
}

export default TestPage;