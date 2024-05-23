/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useEffect, Fragment } from "react";
import { useParams, Link } from "react-router-dom";
import useStoreSurvey from "../store/features/survey";
import Error from "../components/Modals/Error";
import Loader from "../components/Loader/Loader";

interface MyStore {
  loading: boolean;
  error: string | null;
  getSurveyAnswerById: (id: undefined | number | string) => Promise<any>;
}

const ViewSurveyAnswer = () => {
  const { loading, error, getSurveyAnswerById } = useStoreSurvey() as MyStore;

  const [details, setDetails] = useState({
    title: "",
    description: "",
    expiry_date: "",
  });

  const [active, setActive] = useState(false);
  const [data, setData] = useState<any>([
    {
      question: "",
      question_type: "",
      description: "",
      option_data: [
        {
          text: "",
        },
      ],
    },
  ]);

  const { id } = useParams();

  useEffect(() => {
    async function fetchData() {
      const responseData = await getSurveyAnswerById(id);

      if (responseData) {
        setDetails({
          title: responseData.data.title,
          description: responseData.data.description,
          expiry_date: responseData.data.expiry_date,
        });
        setActive(responseData.data.active);
        setData(responseData.data.questions);
      }
    }

    fetchData();
  }, [getSurveyAnswerById, id]);

  if (loading) {
    return <Loader />;
  }

  return (
    <section className="lg:px-8 sm:px-6 px-4 lg:py-4 py-6">
      <div className="flex flex-row items-center justify-end gap-5">
        <Link
          to="/dashboard"
          className="bg-[#0B1120] text-white py-[0.4rem] px-4 rounded-md"
        >
          Dashboard
        </Link>
      </div>
      {error ? <Error message={error} /> : null}
      {details.title && (
        <div className="lg:w-4/5 w-5/5 mx-auto mt-6">
          <h1 className="lg:text-2xl text-xl font-semibold">Title</h1>
          <p className="mt-1 mb-5 lg:text-base text-sm">{details.title}</p>

          <h2 className="lg:text-2xl text-xl font-semibold">Description</h2>
          <p className="mt-1 mb-5 lg:text-base text-sm">
            {details.description}
          </p>

          <h2 className="lg:text-2xl text-xl font-semibold">Expiry Date</h2>
          <p className="mt-1 mb-5 lg:text-base text-sm">
            {details.expiry_date}
          </p>
          <h2 className="lg:text-2xl text-xl font-semibold">Status</h2>
          <p className="mt-1 mb-5 lg:text-base text-sm">{active && "Active"}</p>

          <>
            <h1 className="mt-10 mb-4 lg:text-2xl text-base font-bold">
              Questions
            </h1>

            {data.map((item: any, questionIndex: number) => (
              <Fragment key={questionIndex}>
                <div className="mb-12">
                  <div className="flex lg:flex-row flex-col gap-3 lg:items-center lg:justify-between">
                    <h2 className="font-bold lg:text-xl text-base">
                      {questionIndex + 1}. {item.question}
                    </h2>
                  </div>

                  <h3 className="text-base font-semibold mt-5">Description</h3>

                  <p className="mt-1 mb-5 lg:text-base text-sm">
                    {item.description}
                  </p>

                  <div className="mt-4">
                    {item.question_type === "Textarea" && (
                      <>
                        {[...item.option_data].map(
                          (data: any, index: number) => (
                            <Fragment key={index}>
                              <div className="my-2">{data.text}</div>
                            </Fragment>
                          )
                        )}
                      </>
                    )}
                    {item.question_type === "Text" && (
                      <>
                        {[...item.option_data].map(
                          (data: any, index: number) => (
                            <Fragment key={index}>
                              <div className="my-2">{data.text}</div>
                            </Fragment>
                          )
                        )}
                      </>
                    )}
                    <>
                      {item.question_type === "Checkbox" && (
                        <>
                          <div className="flex flex-row gap-3 items-center justify-between mb-3">
                            <h3 className="font-medium text-base">
                              Selected answer
                            </h3>
                          </div>
                          {[...item.option_data]
                            .filter((option: any) => option.checked)
                            .map((data: any, index: number) => (
                              <Fragment key={index}>
                                <div className="my-2">
                                  <div className="flex flex-row items-center lg:justify-start justify-between gap-4">
                                    <div className="lg:w-[40%] w-[85%] flex flex-row items-center gap-3">
                                      <div className="w-2 h-2 rounded-full bg-black"></div>
                                      <>{data.text}</>
                                    </div>
                                  </div>
                                </div>
                              </Fragment>
                            ))}
                        </>
                      )}
                      {item.question_type === "Radio" && (
                        <>
                          <div className="flex flex-row gap-3 items-center justify-between mb-3">
                            <h3 className="font-medium text-base">
                              Selected answer
                            </h3>
                          </div>
                          {[...item.option_data]
                            .filter((option: any) => option.checked)
                            .map((data: any, index: number) => (
                              <Fragment key={index}>
                                <div className="my-2">
                                  <div className="flex flex-row items-center lg:justify-start justify-between gap-4">
                                    <div className="lg:w-[40%] w-[85%] flex flex-row items-center gap-3">
                                      <div className="w-2 h-2 rounded-full bg-black"></div>
                                      <>{data.text}</>
                                    </div>
                                  </div>
                                </div>
                              </Fragment>
                            ))}
                        </>
                      )}
                      {item.question_type === "Select" && (
                        <>
                          <div className="flex flex-row gap-3 items-center justify-between mb-3">
                            <h3 className="font-medium text-base">
                              Selected answer
                            </h3>
                          </div>
                          {[...item.option_data]
                            .filter((option: any) => option.checked)
                            .map((option: any) => (
                              <Fragment key={option.text}>
                                <div className="my-2">
                                  <div className="flex flex-row items-center lg:justify-start justify-between gap-4">
                                    <div className="lg:w-[40%] w-[85%] flex flex-row items-center gap-3">
                                      <div className="w-2 h-2 rounded-full bg-black"></div>
                                      <>{option.text}</>
                                    </div>
                                  </div>
                                </div>
                              </Fragment>
                            ))}
                        </>
                      )}
                    </>
                  </div>
                </div>
              </Fragment>
            ))}
          </>
        </div>
      )}
    </section>
  );
};

export default ViewSurveyAnswer;
