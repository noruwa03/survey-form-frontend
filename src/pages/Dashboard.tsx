/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, Fragment } from "react";
import useStoreSurvey from "../store/features/survey";
import useStoreAuth from "../store/features/auth";
import Loader from "../components/Loader/Loader";
import Error from "../components/Modals/Error";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";


interface MyStore {
  data: any[];
  loading: boolean;
  error: string | null;
  success: boolean;
  getMySurvey: (id: string) => Promise<any>;
  removeSurvey: (id: undefined | number | string) => Promise<void>;
  cleanUpSuccessfulData: () => void;
}

interface MyAuthStore {
  user: any[] | any;
  signOutSuccess: boolean;
  signOut: () => void;
  cleanUpSignOutSuccess: () => void;
}

const Dashboard = () => {
  const {
    loading,
    error,
    success,
    getMySurvey,
    removeSurvey,
    cleanUpSuccessfulData,
    data,
  } = useStoreSurvey() as MyStore;

  const { user, signOut, signOutSuccess, cleanUpSignOutSuccess } =
    useStoreAuth() as MyAuthStore;

  const navigate = useNavigate();

  const deleteSurvey = async (id: string | number) => {
    removeSurvey(id);
  };

  const url = window.location.origin;

   const share = async (title: string, description: string, id:string) => {
     if (!navigator.share) return;
     const data = {
       title: title,
       text: description,
       url: `${url}/survey/${id}`,
     };

     try {
       return await navigator.share(data);
     } catch (e) {
       console.error(e);
     }
   };

   async function copyToClipBoard(text: any) {
     try {
       return await navigator.clipboard.writeText(text);
     } catch (err) {
       console.log(err)
     }
   }

   const handleCopyClick = (id: string | any) => {
     copyToClipBoard(`${url}/survey/${id}`)
       .then(() => {
         toast.success("Survey copied")
       })
       .catch((err) => {
         console.log(err);
       });
   };

  useEffect(() => {
    if (user.length == 0) {
      navigate("/", { replace: true });
    } else {
      getMySurvey(user.user_id);
    }
  }, [user, navigate, getMySurvey]);

  useEffect(() => {
    if (success) {
      getMySurvey(user.user_id);
    }
    return () => {
      cleanUpSuccessfulData();
    };
  }, [success, cleanUpSuccessfulData, getMySurvey, user]);

  useEffect(() => {
    if (signOutSuccess) {
      navigate("/", { replace: true });
    }
    return () => {
      cleanUpSignOutSuccess();
    };
  }, [signOutSuccess, navigate, cleanUpSignOutSuccess]);

  if (loading) {
    return <Loader />;
  }
  return (
    <>
      {user.length !== 0 ? (
        <section className="lg:px-8 sm:px-6 px-4 lg:py-4 pt-4 pb-8">
          {error ? <Error message={error} /> : null}
          <div className="flex lg:flex-row flex-col items-start justify-between gap-3 lg:mb-0 mb-5">
            <button
              onClick={signOut}
              className="bg-red-400 text-white py-[0.3rem] px-3 rounded-md"
            >
              Sign out
            </button>
            <div className="lg:w-3/5 w-full flex lg:flex-col flex-col-reverse items-end justify-end lg:gap-2 gap-4">
              {" "}
              <div>
                <span className="font-semibold text-xl">Welcome</span>{" "}
                <span className="lg:text-xl text-base">{user.email}</span>
              </div>
              <Link
                to="/create"
                className="bg-[#0B1120] text-white py-[0.3rem] px-3 rounded-md"
              >
                Create survey
              </Link>
            </div>
          </div>

          {data.length !== 0 ? (
            <>
              {" "}
              <h1 className="lg:text-3xl text-2xl font-bold text-center">
                My survey forms
              </h1>
              <div className="lg:w-[65%] w-[100%] mx-auto mt-4 py-3 divide-y-[1px] divide-[#D9D9D9]">
                {data.map((item: any, index: number) => (
                  <Fragment key={index}>
                    <div className="flex flex-col py-4">
                      <div className="flex flex-row flex-wrap gap-3 items-center justify-between">
                        <h2 className="font-semibold lg:text-2xl text-xl">
                          {item.title}
                        </h2>
                        <p className="font-medium lg:text-base text-sm">
                          Status:
                          {item.active ? (
                            <span className="ms-2 text-green-400">Active</span>
                          ) : (
                            <span className="ms-2 text-red-400">Inactive</span>
                          )}
                        </p>
                      </div>

                      <div className="flex lg:flex-row flex-col lg:items-center items-start justify-between lg:gap-4 gap-2 mt-3">
                        <p className="text-sm font-normal text-gray-400 lg:mt-2">
                          <span className="text-black">Expire date:</span>{" "}
                          {item.expiry_date}
                        </p>
                        <p className="text-sm font-normal text-gray-400 lg:mt-2">
                          <span className="text-black">Last update:</span>{" "}
                          {item.updated_at}
                        </p>
                      </div>

                      <p className="lg:text-base text-[0.95em] mt-2 mb-1">
                        {item.description}
                      </p>
                      <div
                        onClick={() =>
                          share(item.title, item.description, item.survey_id)
                        }
                        className="flex flex-row items-center justify-start lg:gap-6 gap-4 mt-3"
                      >
                        <div className="cursor-pointer text-sm font-normal text-gray-400 mt-2 flex flex-row items-center justify-start gap-1">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="16"
                            height="16"
                            fill="currentColor"
                            className="bi bi-send"
                            viewBox="0 0 16 16"
                          >
                            <path d="M15.854.146a.5.5 0 0 1 .11.54l-5.819 14.547a.75.75 0 0 1-1.329.124l-3.178-4.995L.643 7.184a.75.75 0 0 1 .124-1.33L15.314.037a.5.5 0 0 1 .54.11ZM6.636 10.07l2.761 4.338L14.13 2.576zm6.787-8.201L1.591 6.602l4.339 2.76z" />
                          </svg>
                          Share
                        </div>
                        <div
                          onClick={() => handleCopyClick(item.survey_id)}
                          className="cursor-pointer text-sm font-normal text-gray-400 mt-2 flex flex-row items-center justify-start gap-1"
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="16"
                            height="16"
                            fill="currentColor"
                            className="bi bi-copy"
                            viewBox="0 0 16 16"
                          >
                            <path
                              fillRule="evenodd"
                              d="M4 2a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2zm2-1a1 1 0 0 0-1 1v8a1 1 0 0 0 1 1h8a1 1 0 0 0 1-1V2a1 1 0 0 0-1-1zM2 5a1 1 0 0 0-1 1v8a1 1 0 0 0 1 1h8a1 1 0 0 0 1-1v-1h1v1a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h1v1z"
                            />
                          </svg>
                          Copy
                        </div>
                      </div>
                      <div className="flex flex-row flex-wrap items-center justify-end lg:gap-5 gap-3 text-sm lg:mt-3 mt-6">
                        <Link
                          to={`/response/${item.survey_id}`}
                          className="bg-[#0B1120] text-white py-[0.3rem] px-3 rounded-md"
                        >
                          View response
                        </Link>
                        <Link
                          to={`/survey/${item.survey_id}`}
                          className="bg-teal-400 text-white py-[0.3rem] px-3 rounded-md"
                        >
                          View survey
                        </Link>
                        <Link
                          to={`/edit/${item.survey_id}`}
                          className="bg-green-400 text-white py-[0.3rem] px-3 rounded-md"
                        >
                          Edit survey
                        </Link>
                        <div
                          onClick={() => deleteSurvey(item.survey_id)}
                          className="cursor-pointer bg-red-400 text-white py-[0.3rem] px-3 rounded-md"
                        >
                          Delete
                        </div>
                      </div>
                    </div>
                  </Fragment>
                ))}
              </div>
            </>
          ) : (
            <h4 className="text-center text-xl mt-8">
              No data found, create survey
            </h4>
          )}
        </section>
      ) : null}
    </>
  );
};

export default Dashboard;
