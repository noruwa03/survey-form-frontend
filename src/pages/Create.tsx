/* eslint-disable @typescript-eslint/no-explicit-any */
import { ChangeEvent, Fragment, useState, useEffect } from "react";
import questionType from "../shared/question.types";
import { useNavigate, Link } from "react-router-dom";
import useStoreAuth from "../store/features/auth";
import useStoreSurvey from "../store/features/survey";
import Error from "../components/Modals/Error";
import Loader from "../components/Loader/Loader";
import Unauthorized from "../components/Modals/Unauthorized";

interface MyAuthStore {
  user: any[] | any;
}

interface MyStore {
  loading: boolean;
  error: string | null;
  success: boolean;
  createSurvey: (payload: any) => Promise<void>;
  cleanUpSuccessfulData: () => void;
}

const Create = () => {
  const { user } = useStoreAuth() as MyAuthStore;

  const { loading, success, error, cleanUpSuccessfulData, createSurvey } =
    useStoreSurvey() as MyStore;
  const [details, setDetails] = useState({
    title: "",
    description: "",
    expiry_date: "",
  });
  const [active, setActive] = useState(false);
  const [questionInput, showQuestionInput] = useState(false);

  const navigate = useNavigate();

  const handleCheckbox = (evt: any) => {
    setActive(evt.target.checked);
  };

  const userFormHandler = (
    evt: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = evt.target;

    setDetails((prev: any) => ({ ...prev, [name]: value }));
  };

  const [data, setData] = useState<any>([
    {
      question: "",
      question_type: "",
      description: "",
      option_data: [
        {
          text: "",
          checked: false,
        },
      ],
    },
  ]);

  const handleChange = (
    evt: ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >,
    index: number
  ) => {
    const { name, value } = evt.target;
    const item = [...data];
    item[index][name] = value;
    setData(item);
  };

  const optionHandleChange = (
    evt: any,
    questionIndex: number,
    index: number
  ) => {
    setData((prevData: any) =>
      prevData.map((item: any, qIdx: any) =>
        qIdx === questionIndex
          ? {
              ...item,
              option_data: item.option_data.map((option: any, oIdx: any) =>
                oIdx === index ? { ...option, text: evt.target.value } : option
              ),
            }
          : item
      )
    );
  };

  const addQuestion = () => {
    if (questionInput) {
      const concatQuestion = [
        ...data,
        {
          question: "",
          question_type: "",
          description: "",
          option_data: [
            {
              text: "",
              checked: false,
            },
          ],
        },
      ];
      setData(concatQuestion);
    } else {
      showQuestionInput(true);
    }
  };

  const addOption = (index: number) => {
    const oldArr = data[index].option_data;
    const newArr = [
      ...oldArr,
      {
        text: "",
        checked: false,
      },
    ];

    setData((prevData: any) =>
      prevData.map((item: any, idx: number) =>
        idx === index ? { ...item, option_data: newArr } : item
      )
    );
  };

  const delOption = (questionIndex: number, index: number) => {
    setData((prevData: any) =>
      prevData.map((item: any, qIdx: any) =>
        qIdx === questionIndex
          ? {
              ...item,
              option_data: item.option_data.filter(
                (_: any, oIdx: any) => oIdx !== index
              ),
            }
          : item
      )
    );
  };

  const delQuestion = (index: number) => {
    const del = [...data];
    del.splice(index, 1);
    setData(del);
  };

  const timeFormat = (new Date()).getTimezoneOffset() * 60000;
  const localISOTime = new Date(Date.now() - timeFormat)
    .toISOString()
    .slice(0, -1);


  const submitHandler = async (evt: any) => {
    evt.preventDefault();
    const formData = {
      ...details,
      active: active,
      questions: data,
      user_id: user.user_id,
      created_at: localISOTime,
      updated_at: localISOTime,
    };

    createSurvey(formData);
  };

  useEffect(() => {
    if (success) {
      navigate("/dashboard", { replace: true });
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
      {user.length !== 0 ? (
        <section className="lg:px-8 sm:px-6 px-4 lg:py-6 py-6">
          {error ? <Error message={error} /> : null}
          <div className="grid place-content-end">
            <Link
              to="/dashboard"
              className="bg-[#0B1120] text-white py-[0.4rem] px-4 rounded-md"
            >
              Dashboard
            </Link>
          </div>
          <form
            onSubmit={submitHandler}
            className="lg:w-4/5 w-5/5 mx-auto mt-2"
          >
            <h1 className="mb-4 lg:text-2xl text-2xl font-bold">Survey Form</h1>

            <label htmlFor="Title" className="text-base font-semibold">
              Title
            </label>
            <input
              type="text"
              id="Title"
              name="title"
              value={details.title}
              onChange={userFormHandler}
              required
              className="block w-full mt-1 mb-5 outline-none border-[1px] border-gray-300 focus:border-[#0B1120] px-4 py-[0.4rem] rounded-lg placeholder:text-[#C4C4C4] placeholder:font-normal placeholder:text-sm lg:text-base text-sm"
              placeholder="Title"
            />

            <label htmlFor="Description" className="text-base font-semibold">
              Description
            </label>
            <textarea
              id="Description"
              name="description"
              value={details.description}
              onChange={userFormHandler}
              required
              className="block resize-none h-24 w-full mt-1 mb-5 outline-none border-[1px] border-gray-300 focus:border-[#0B1120] px-4 py-[0.4rem] rounded-lg placeholder:text-[#C4C4C4] placeholder:font-normal placeholder:text-sm lg:text-base text-sm"
            />

            <label htmlFor="ExpiryDate" className="text-base font-semibold">
              Expiry Date
            </label>
            <input
              type="datetime-local"
              id="ExpiryDate"
              name="expiry_date"
              value={details.expiry_date}
              onChange={userFormHandler}
              required
              className="block sm:w-[24%] w-[80%] mt-1 mb-5 outline-none border-[1px] border-gray-300 focus:border-[#0B1120] px-4 py-[0.4rem] rounded-lg placeholder:text-[#C4C4C4] placeholder:font-normal placeholder:text-sm lg:text-base text-sm"
            />

            <label htmlFor="Active" className="text-base font-semibold">
              Active
            </label>
            <input
              type="checkbox"
              id="Active"
              checked={active}
              onChange={handleCheckbox}
              className="mt-1 block w-4 h-4 text-[#0B1120] bg-gray-100 border-gray-300 rounded focus:ring-[#0B1120] focus:ring-2"
            />

            {questionInput && (
              <>
                <h1 className="mt-10 mb-4 lg:text-2xl text-base font-bold">
                  Questions
                </h1>
                {data.map((item: any, questionIndex: number) => (
                  <Fragment key={questionIndex}>
                    <div className="mb-12">
                      <div className="flex lg:flex-row flex-col gap-3 lg:items-center lg:justify-between">
                        <h2 className="font-medium lg:text-xl text-base">
                          {questionIndex + 1}. {item.question}
                        </h2>
                        <div
                          className="lg:w-[6rem] w-[6rem] py-[0.4rem] rounded-md text-sm bg-red-400 text-white mb-3 cursor-pointer flex flex-row items-center justify-center gap-2"
                          onClick={() => delQuestion(questionIndex)}
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="16"
                            height="16"
                            fill="currentColor"
                            className="bi bi-trash3"
                            viewBox="0 0 16 16"
                          >
                            <path d="M6.5 1h3a.5.5 0 0 1 .5.5v1H6v-1a.5.5 0 0 1 .5-.5M11 2.5v-1A1.5 1.5 0 0 0 9.5 0h-3A1.5 1.5 0 0 0 5 1.5v1H1.5a.5.5 0 0 0 0 1h.538l.853 10.66A2 2 0 0 0 4.885 16h6.23a2 2 0 0 0 1.994-1.84l.853-10.66h.538a.5.5 0 0 0 0-1zm1.958 1-.846 10.58a1 1 0 0 1-.997.92h-6.23a1 1 0 0 1-.997-.92L3.042 3.5zm-7.487 1a.5.5 0 0 1 .528.47l.5 8.5a.5.5 0 0 1-.998.06L5 5.03a.5.5 0 0 1 .47-.53Zm5.058 0a.5.5 0 0 1 .47.53l-.5 8.5a.5.5 0 1 1-.998-.06l.5-8.5a.5.5 0 0 1 .528-.47M8 4.5a.5.5 0 0 1 .5.5v8.5a.5.5 0 0 1-1 0V5a.5.5 0 0 1 .5-.5" />
                          </svg>
                          Remove
                        </div>
                      </div>
                      <div className="flex lg:flex-row flex-col lg:items-center items-start lg:justify-between justify-start gap-4">
                        <div className="lg:w-[70%] w-full">
                          <label
                            htmlFor={`QuestionText-${questionIndex}`}
                            className="lg:text-base text-sm font-semibold"
                          >
                            Question
                          </label>
                          <input
                            type="text"
                            name="question"
                            id={`QuestionText-${questionIndex}`}
                            value={item.question}
                            onChange={(evt) => handleChange(evt, questionIndex)}
                            required
                            className="block w-full mt-1 lg:mb-5 mb-0 outline-none border-[1px] border-gray-300 focus:border-[#0B1120] px-4 py-[0.4rem] rounded-lg placeholder:text-[#C4C4C4] placeholder:font-normal placeholder:text-sm lg:text-base text-sm"
                          />
                        </div>
                        <div className="lg:w-[30%] w-full">
                          <label
                            htmlFor={`QuestionType-${questionIndex}`}
                            className="lg:text-base text-sm font-semibold"
                          >
                            Question Type
                          </label>
                          <select
                            name="question_type"
                            id={`QuestionType-${questionIndex}`}
                            value={item.question_type}
                            onChange={(evt) => handleChange(evt, questionIndex)}
                            required
                            className="block w-full mt-1 lg:mb-5 mb-4 outline-none border-[1px] border-gray-300 focus:border-[#0B1120] px-4 py-[0.4rem] rounded-lg placeholder:text-[#C4C4C4] placeholder:font-normal placeholder:text-sm lg:text-base text-sm"
                          >
                            <option value="" disabled>
                              Select an option
                            </option>
                            {questionType.map((option: any) => (
                              <option key={option.id} value={option.name}>
                                {option.otherName}
                              </option>
                            ))}
                          </select>
                        </div>
                      </div>
                      <label
                        htmlFor={`Description-${questionIndex}`}
                        className="text-base font-semibold"
                      >
                        Description
                      </label>
                      <textarea
                        id={`Description-${questionIndex}`}
                        name="description"
                        value={item.description}
                        onChange={(evt) => handleChange(evt, questionIndex)}
                        required
                        className="block resize-none h-24 w-full mt-1 mb-5 outline-none border-[1px] border-gray-300 focus:border-[#0B1120] px-4 py-[0.4rem] rounded-lg placeholder:text-[#C4C4C4] placeholder:font-normal placeholder:text-sm lg:text-base text-sm"
                      />
                      <div className="mt-4">
                        {item.question_type === "Text" ||
                        item.question_type === "Textarea" ||
                        item.question_type === "" ? null : (
                          <>
                            <div className="flex flex-row gap-3 items-center justify-between mb-3">
                              <h3 className="font-medium text-base">Options</h3>
                              <div
                                className="lg:w-[7.5rem] w-[8rem] py-[0.4rem] rounded-md text-sm bg-black text-white cursor-pointer flex flex-row items-center justify-center gap-2"
                                onClick={() => addOption(questionIndex)}
                              >
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  width="16"
                                  height="16"
                                  fill="currentColor"
                                  className="bi bi-plus-lg stroke-white"
                                  viewBox="0 0 16 16"
                                >
                                  <path
                                    fillRule="evenodd"
                                    d="M8 2a.5.5 0 0 1 .5.5v5h5a.5.5 0 0 1 0 1h-5v5a.5.5 0 0 1-1 0v-5h-5a.5.5 0 0 1 0-1h5v-5A.5.5 0 0 1 8 2"
                                  />
                                </svg>
                                Add Option
                              </div>
                            </div>

                            {[...item.option_data].map(
                              (_: any, index: number) => (
                                <Fragment key={index}>
                                  <div className="my-2">
                                    <div className="flex flex-row items-center lg:justify-start justify-between gap-4">
                                      <div className="lg:w-[40%] w-[85%] flex flex-row items-center gap-3">
                                        <div className="w-2 h-2 rounded-full bg-black"></div>
                                        <input
                                          type="text"
                                          onChange={(evt) =>
                                            optionHandleChange(
                                              evt,
                                              questionIndex,
                                              index
                                            )
                                          }
                                          required
                                          className="block w-full outline-none border-[1px] border-gray-300 focus:border-[#0B1120] px-4 py-[0.4rem] rounded-lg placeholder:text-[#C4C4C4] placeholder:font-normal placeholder:text-sm lg:text-base text-sm"
                                        />
                                      </div>
                                      <div
                                        onClick={() =>
                                          delOption(questionIndex, index)
                                        }
                                        className="lg:w-[4%] w-[15%] py-[0.5rem] bg-red-400 rounded-md grid place-content-center cursor-pointer"
                                      >
                                        <svg
                                          xmlns="http://www.w3.org/2000/svg"
                                          width="16"
                                          height="16"
                                          fill="currentColor"
                                          className="bi bi-trash3 fill-white"
                                          viewBox="0 0 16 16"
                                        >
                                          <path d="M6.5 1h3a.5.5 0 0 1 .5.5v1H6v-1a.5.5 0 0 1 .5-.5M11 2.5v-1A1.5 1.5 0 0 0 9.5 0h-3A1.5 1.5 0 0 0 5 1.5v1H1.5a.5.5 0 0 0 0 1h.538l.853 10.66A2 2 0 0 0 4.885 16h6.23a2 2 0 0 0 1.994-1.84l.853-10.66h.538a.5.5 0 0 0 0-1zm1.958 1-.846 10.58a1 1 0 0 1-.997.92h-6.23a1 1 0 0 1-.997-.92L3.042 3.5zm-7.487 1a.5.5 0 0 1 .528.47l.5 8.5a.5.5 0 0 1-.998.06L5 5.03a.5.5 0 0 1 .47-.53Zm5.058 0a.5.5 0 0 1 .47.53l-.5 8.5a.5.5 0 1 1-.998-.06l.5-8.5a.5.5 0 0 1 .528-.47M8 4.5a.5.5 0 0 1 .5.5v8.5a.5.5 0 0 1-1 0V5a.5.5 0 0 1 .5-.5" />
                                        </svg>
                                      </div>
                                    </div>
                                  </div>
                                </Fragment>
                              )
                            )}
                          </>
                        )}
                      </div>
                    </div>
                  </Fragment>
                ))}
              </>
            )}

            <div className="w-4/5 mx-auto mt-8 lg:mb-0 mb-6">
              {" "}
              <div
                onClick={addQuestion}
                className="w-full text-center bg-white py-3 outline-none text-black text-base font-medium rounded-lg border-[1px] border-black cursor-pointer"
              >
                Add more questions
              </div>
            </div>
            <button className="w-full text-center bg-[#0B1120] py-3 outline-none text-white text-base font-medium mt-6 lg:mb-16 mb-8 rounded-lg cursor-pointer">
              Save
            </button>
          </form>
        </section>
      ) : (
        <Unauthorized />
      )}
    </>
  );
};

export default Create;
