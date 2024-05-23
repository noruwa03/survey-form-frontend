/* eslint-disable @typescript-eslint/no-explicit-any */
import { Fragment, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import useStoreSurvey from "../store/features/survey";
import Loader from "../components/Loader/Loader";
import Error from "../components/Modals/Error";

interface MyStore {
  surveyResponseData: any[];
  loading: boolean;
  error: string | null;
  getMySurveyResponse: (id: undefined | number | string) => Promise<any>;
}

const Response = () => {
  const { loading, error, getMySurveyResponse, surveyResponseData } =
    useStoreSurvey() as MyStore;

  const { id } = useParams();

  useEffect(() => {
    getMySurveyResponse(id);
  }, [getMySurveyResponse, id]);

  if (loading) {
    return <Loader />;
  }
  return (
    <section className="lg:px-8 sm:px-6 px-4 lg:py-4 py-8">
      {error ? <Error message={error} /> : null}
      {surveyResponseData.length !== 0 ? (
        <>
          <div className="flex flex-row items-center justify-end gap-5">
            <Link
              to="/dashboard"
              className="bg-[#0B1120] text-white py-[0.4rem] px-4 rounded-md"
            >
              Go back
            </Link>
          </div>
          <h1 className="lg:text-3xl text-2xl font-bold text-center">
            Response
          </h1>
          <div className="grid grid-cols-8 gap-5 lg:w-[90%] w-full mx-auto my-6">
            {surveyResponseData.map((item: any, index: number) => (
              <Fragment key={index}>
                <div className="lg:col-span-2 sm:col-span-4 col-span-8 bg-white rounded-2xl shadow-[0_0px_4px_-1.76px_rgba(0,0,0,0.3)] p-[1rem]">
                  <h2 className="font-semibold mb-2 lg:text-xl text-xl">
                    {item.title.substring(0, 40)}
                    {item.title.length >= 20 && "..."}
                  </h2>
                  {/* <h3 className="text-base text-[#898989] font-medium my-2">
                    {item.description.substring(0, 40)}
                    {item.description.length >= 20 && "..."}
                  </h3> */}
                  <h4 className="text-base text-[#898989] font-medium my-2">
                    Questions: {item.questions.length}
                  </h4>
                  <p className="text-sm font-normal text-gray-400 mt-2">
                    <span className="text-black">Answered:</span>{" "}
                    {item.created_at}
                  </p>
                  <div className="w-full mt-4">
                    {" "}
                    <Link
                      to={`/view-survey/${item.survey_answer_id}`}
                      className="block text-center w-full bg-[#0B1120] rounded-md text-white py-[0.3rem] px-3"
                    >
                      View response
                    </Link>
                  </div>
                </div>
              </Fragment>
            ))}
          </div>
        </>
      ) : (
        <h1 className="mt-6 lg:text-3xl text-2xl font-bold text-center">
          You have no response to your survey yet!
        </h1>
      )}
    </section>
  );
};

export default Response;
