/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useEffect, Fragment } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import useStoreSurvey from "../store/features/survey";
import useStoreAuth from "../store/features/auth";
import Error from "../components/Modals/Error";
import Loader from "../components/Loader/Loader";

interface MyAuthStore {
  user: any[] | any;
}

interface MyStore {
  loading: boolean;
  error: string | null;
  success: boolean;
  surveyDataById: any[] | any;
  getSurveyById: (id: undefined | number | string) => Promise<any>;
  answerSurvey: (payload: any) => Promise<void>;
  cleanUpSuccessfulData: () => void;
}

const Survey = () => {
  const { user } = useStoreAuth() as MyAuthStore;

  const {
    loading,
    success,
    error,
    surveyDataById,
    cleanUpSuccessfulData,
    getSurveyById,
    answerSurvey,
  } = useStoreSurvey() as MyStore;

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

  const [selectedValue, setSelectedValue] = useState<any>([{ text: "" }]);

  const { id } = useParams();

  const navigate = useNavigate();

  const textHandleChange = (evt: any, questionIndex: number, index: number) => {
    data[questionIndex].option_data[index].text = evt.target.value;
  };

  const selectHandleChange = (evt: any, questionIndex: number) => {
    const selectedValue = evt.target.value;
    const index = evt.target.selectedIndex - 1;
    setSelectedValue(selectedValue);

    data[questionIndex].option_data[index] = {
      text: evt.target.value,
      checked: true,
    };

    const dataArr = data[questionIndex].option_data;

    // Setting others to false
    dataArr.map((data: any, idx: number) => {
      if (idx !== index) {
        dataArr[idx] = {
          text: data.text,
          checked: false,
        };
      }
    });
  };

  const checkboxOptionHandleChange = (
    evt: any,
    questionIndex: number,
    index: number
  ) => {
    data[questionIndex].option_data[index] = {
      text: evt.target.value,
      checked: evt.target.checked,
    };
  };

  const radioOptionHandleChange = (
    evt: any,
    questionIndex: number,
    index: number
  ) => {
    // Setting selected radio to true here
    data[questionIndex].option_data[index] = {
      text: evt.target.value,
      checked: true,
    };

    const dataArr = data[questionIndex].option_data;

    // Setting others to false
    dataArr.map((data: any, idx: number) => {
      if (idx !== index) {
        dataArr[idx] = {
          text: data.text,
          checked: false,
        };
      }
    });
  };

  const timeFormat = new Date().getTimezoneOffset() * 60000;
  const localISOTime = new Date(Date.now() - timeFormat)
    .toISOString()
    .slice(0, -1);

  const submitHandler = async (evt: any) => {
    evt.preventDefault();
    const formData = {
      survey_id: id,
      ...details,
      active: active,
      questions: data,
      user_id: surveyDataById.data.user_id,
      created_at: localISOTime,
      updated_at: localISOTime,
    };

    answerSurvey(formData);
  };

  useEffect(() => {
    async function fetchData() {
      const responseData = await getSurveyById(id);

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
  }, [getSurveyById, id]);

  useEffect(() => {
    if (success) {
      navigate("/", { replace: true });
    }
    return () => {
      cleanUpSuccessfulData();
    };
  }, [success, navigate, cleanUpSuccessfulData]);

  if (loading) {
    return <Loader />;
  }

  return (
    <>
      {active ? (
        <section className="lg:px-8 sm:px-6 px-4 lg:py-6 py-6">
          {user.length !== 0 ? (
            <div className="flex flex-row items-center justify-end gap-5">
              <Link
                to="/dashboard"
                className="bg-[#0B1120] text-white py-[0.4rem] px-4 rounded-md"
              >
                Dashboard
              </Link>
            </div>
          ) : null}

          {error ? <Error message={error} /> : null}
          <form
            onSubmit={submitHandler}
            className={`lg:w-4/5 w-5/5 mx-auto ${
              user.length == 0 ? "mt-8" : ""
            }`}
          >
            {/* <h1 className="mt-6 mb-4 lg:text-3xl text-2xl font-bold text-center">
            Norw Survey Form
          </h1> */}
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

                    <h3 className="text-base font-semibold mt-5">
                      Description
                    </h3>

                    <p className="mt-1 mb-5 lg:text-base text-sm">
                      {item.description}
                    </p>

                    <div className="mt-4">
                      {item.question_type === "Textarea" && (
                        <>
                          {[...item.option_data].map(
                            (data: any, index: number) => (
                              <Fragment key={index}>
                                <div className="my-2">
                                  <textarea
                                    defaultValue={data.text}
                                    onChange={(evt) =>
                                      textHandleChange(
                                        evt,
                                        questionIndex,
                                        index
                                      )
                                    }
                                    required
                                    className="block resize-none h-40 w-full mt-1 mb-5 outline-none border-[1px] border-gray-300 focus:border-[#0B1120] px-4 py-[0.4rem] rounded-lg placeholder:text-[#C4C4C4] placeholder:font-normal placeholder:text-sm lg:text-base text-sm"
                                  />
                                </div>
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
                                <div className="my-2">
                                  <input
                                    defaultValue={data.text}
                                    onChange={(evt) =>
                                      textHandleChange(
                                        evt,
                                        questionIndex,
                                        index
                                      )
                                    }
                                    required
                                    className="block w-full mt-1 mb-5 outline-none border-[1px] border-gray-300 focus:border-[#0B1120] px-4 py-[0.4rem] rounded-lg placeholder:text-[#C4C4C4] placeholder:font-normal placeholder:text-sm lg:text-base text-sm"
                                  />
                                </div>
                              </Fragment>
                            )
                          )}
                        </>
                      )}
                      <>
                        {item.question_type === "Checkbox" && (
                          <>
                            <div className="flex flex-row gap-3 items-center justify-between mb-3">
                              <h3 className="font-medium text-base">Options</h3>
                            </div>
                            {[...item.option_data].map(
                              (data: any, index: number) => (
                                <Fragment key={index}>
                                  <div className="my-2">
                                    <div className="flex flex-row items-center lg:justify-start justify-between gap-4">
                                      <div className="lg:w-[40%] w-[85%] flex flex-row items-center gap-3">
                                        <div className="w-2 h-2 rounded-full bg-black"></div>
                                        <>
                                          <input
                                            type="checkbox"
                                            defaultValue={data.text}
                                            onChange={(evt) =>
                                              checkboxOptionHandleChange(
                                                evt,
                                                questionIndex,
                                                index
                                              )
                                            }
                                          />
                                          {data.text}
                                        </>
                                      </div>
                                    </div>
                                  </div>
                                </Fragment>
                              )
                            )}
                          </>
                        )}
                        {item.question_type === "Radio" && (
                          <>
                            <div className="flex flex-row gap-3 items-center justify-between mb-3">
                              <h3 className="font-medium text-base">
                                Linear option
                              </h3>
                            </div>
                            <div className="bg-gray-50 rounded-md p-2 lg:w-4/5 w-full mx-auto flex flex-row sm:items-center sm:justify-center flex-wrap lg:gap-7 gap-4 whitespace-nowrap">
                              {[...item.option_data].map(
                                (data: any, index: number) => (
                                  <Fragment key={index}>
                                    <label
                                      htmlFor={`Radio-${questionIndex}-${index}`}
                                      className="bg-gray-100 py-1 px-2 rounded-md"
                                    >
                                      <div className="flex flex-row items-center gap-3">
                                        <input
                                          type="radio"
                                          id={`Radio-${questionIndex}-${index}`}
                                          name={`radio-${questionIndex}`}
                                          defaultValue={data.text}
                                          onChange={(evt) =>
                                            radioOptionHandleChange(
                                              evt,
                                              questionIndex,
                                              index
                                            )
                                          }
                                          required
                                        />
                                        {data.text}
                                      </div>
                                    </label>
                                  </Fragment>
                                )
                              )}
                            </div>
                          </>
                        )}
                        {item.question_type === "Select" && (
                          <>
                            <div className="flex flex-row gap-3 items-center justify-between mb-3">
                              <h3 className="font-medium text-base">Options</h3>
                            </div>
                            <select
                              value={selectedValue[0].text}
                              onChange={(evt) =>
                                selectHandleChange(evt, questionIndex)
                              }
                              required
                              className="block w-full mt-1 lg:mb-5 mb-4 outline-none border-[1px] border-gray-300 focus:border-[#0B1120] px-4 py-[0.4rem] rounded-lg placeholder:text-[#C4C4C4] placeholder:font-normal placeholder:text-sm lg:text-base text-sm"
                            >
                              <option value="" disabled>
                                Select an option
                              </option>
                              {[...item.option_data].map((option: any) => (
                                <option key={option.text} value={option.text}>
                                  {option.text}
                                </option>
                              ))}
                            </select>
                          </>
                        )}
                      </>
                    </div>
                  </div>
                </Fragment>
              ))}
            </>

            <button className="w-full text-center bg-[#0B1120] py-3 outline-none text-white text-base font-medium mt-6 lg:mb-16 mb-8 rounded-lg cursor-pointer">
              Submit
            </button>
          </form>
        </section>
      ) : (
        <div className="my-8">
          {" "}
          <h1 className="text-center lg:text-2xl text-xl font-semibold">
            Survey not active
          </h1>
          <button
            onClick={() => navigate("/", { replace: true })}
            className="block text-center w-4/5 mx-auto bg-black py-3 outline-none text-white text-base font-medium mt-4 rounded-lg"
          >
            Go home
          </button>
        </div>
      )}
    </>
  );
};

export default Survey;
