import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getAssessmentById, updateAssessment, updateAssessmentLevel } from "../services/api";
import "../styles/AssessmentsTest.css";

const LEVELS = ["Nothing", "Letter Level", "Word Level", "Paragraph Level", "Comprehension Level"];
const IMAGES = {
    "Nothing": ["letters1.jpg", "letters2.jpg", "letters3.jpg", "letters4.jpg", "letters5.jpg", "letters6.jpg", "letters7.jpg", "letters8.jpg", "letters9.jpg", "letters10.jpg", "letters11.jpg", "letters12.jpg", "letters13.jpg", "letters14.jpg", "letters15.jpg", "letters16.jpg", "letters17.jpg", "letters18.jpg", "letters19.jpg", "letters20.jpg", "letters21.jpg", "letters22.jpg", "letters23.jpg", "letters24.jpg", "letters25.jpg", "letters26.jpg", "letters27.jpg", "letters28.jpg", "letters29.jpg", "letters30.jpg"],
    "Letter Level": ["words1.jpg", "words2.jpg", "words3.jpg", "words4.jpg", "words5.jpg", "words6.jpg", "words7.jpg", "words8.jpg", "words9.jpg", "words10.jpg", "words11.jpg", "words12.jpg", "words13.jpg", "words14.jpg", "words15.jpg", "words16.jpg", "words17.jpg", "words18.jpg", "words19.jpg", "words20.jpg", "words21.jpg", "words22.jpg", "words23.jpg", "words24.jpg", "words25.jpg", "words26.jpg", "words27.jpg", "words28.jpg", "words29.jpg"],
    "Word Level": ["sentence1.jpg", "sentence2.jpg", "sentence3.jpg", "sentence4.jpg", "sentence5.jpg", "sentence6.jpg", "sentence7.jpg", "sentence8.jpg", "sentence9.jpg", "sentence10.jpg"],
    "Paragraph Level": ["StatementQuestion1.jpg", "StatementQuestion2.jpg", "StatementQuestion3.jpg", "StatementQuestion4.jpg", "StatementQuestion5.jpg", "StatementQuestion6.jpg", "StatementQuestion7.jpg", "StatementQuestion8.jpg", "StatementQuestion9.jpg", "StatementQuestion10.jpg"]
};

function shuffleArray(array) {
    return array.sort(() => Math.random() - 0.5);
}

function AssessmentsTest() {
    const { assessmentId } = useParams();
    const navigate = useNavigate();
    const [assessment, setAssessment] = useState(null);
    const [shuffledImages, setShuffledImages] = useState([]);
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const [dialog, setDialog] = useState({ show: false, type: null });
    const [showCongrats, setShowCongrats] = useState(false);

    useEffect(() => {
        const fetchAssessment = async () => {
            if (!assessmentId) return;
            const token = localStorage.getItem("token");
            if (!token) return;

            try {
                const data = await getAssessmentById(token, assessmentId);
                setAssessment(data);
                setShuffledImages(shuffleArray([...IMAGES[data.level] || []]));
            } catch (error) {
                console.error("Error fetching assessment:", error);
            }
        };
        fetchAssessment();
    }, [assessmentId]);

    const handleNextImage = () => setCurrentImageIndex((prev) => (prev + 1) % shuffledImages.length);
    const handlePrevImage = () => setCurrentImageIndex((prev) => (prev - 1 + shuffledImages.length) % shuffledImages.length);

    const handleContinue = () => setDialog({ show: true, type: "continue" });
    const handleStop = () => setDialog({ show: true, type: "stop" });

    const confirmAction = async () => {
        if (!assessment) return;
        const token = localStorage.getItem("token");

        if (dialog.type === "continue") {
            const nextLevelIndex = LEVELS.indexOf(assessment.level) + 1;
            if (nextLevelIndex >= LEVELS.length) return;

            const newLevel = LEVELS[nextLevelIndex];
            const newStatus = newLevel === "Comprehension Level" ? "Completed" : "Started";

            try {
                await updateAssessmentLevel(assessmentId, newLevel, token);
                await updateAssessment(assessmentId, { status: newStatus }, token);
                setAssessment((prev) => ({ ...prev, level: newLevel, status: newStatus }));
                setShuffledImages(shuffleArray([...IMAGES[newLevel] || []]));
                setCurrentImageIndex(0);
            } catch (error) {
                console.error("Error updating assessment:", error);
            }

            if (newLevel === "Comprehension Level") {
                navigate("/dashboard");
            }
        } else if (dialog.type === "stop") {
            try {
                await updateAssessment(assessmentId, { status: "Completed" }, token);
                setAssessment((prev) => ({ ...prev, status: "Completed" }));
                setShowCongrats(true);
            } catch (error) {
                console.error("Error marking assessment as completed:", error);
            }
        }

        setDialog({ show: false, type: null });
    };

    if (!assessment) return <div>Loading...</div>;

    return (
        <div className="assessment-container">
            <h2 className="assessment-title">Assessment #{assessmentId}</h2>

            {assessment.level !== "Comprehension Level" && (
                <>
                    <div className="image-container">
                        <button className="button button-back" onClick={handlePrevImage}>Back</button>
                        <img src={`/images/${shuffledImages[currentImageIndex]}`} alt="Assessment" className="assessment-image" />
                        <button className="button button-next" onClick={handleNextImage}>Next</button>
                    </div>
                    <div className="button-container">
                        <button className="button button-stop" onClick={handleStop}>Stop</button>
                        <button className="button button-continue" onClick={handleContinue}>Continue</button>
                    </div>
                </>
            )}

            {assessment.level === "Comprehension Level" && <div className="completed-message">Assessment Completed!</div>}

            {dialog.show && (
                <div className="dialog-overlay">
                    <div className="dialog-box">
                        <p style={{ textAlign: "center", fontSize: "18px", marginBottom: "15px" }}>
                            {dialog.type === "continue" ? "Are you sure you want to continue?" : "Are you sure you want to stop? This will mark the assessment as Completed."}
                        </p>
                        <div className="dialog-buttons">
                            <button onClick={confirmAction} className="dialog-button confirm">Yes</button>
                            <button onClick={() => setDialog({ show: false, type: null })} className="dialog-button cancel">No</button>
                        </div>
                    </div>
                </div>
            )}

            {showCongrats && (
                <div className="dialog-overlay">
                    <div className="dialog-box">
                        <h3 style={{ textAlign: "center" }}>Congratulations!</h3>
                        <p style={{ textAlign: "center" }}>
                            You have completed the assessment with a level of <strong>{assessment.level}</strong>.
                        </p>
                        <button onClick={() => navigate("/dashboard")} className="dialog-button confirm">OK</button>
                    </div>
                </div>
            )}
        </div>
    );
}

export default AssessmentsTest;
