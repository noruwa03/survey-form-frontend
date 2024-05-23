/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, Fragment } from "react";
import useStoreSurvey from "../store/features/survey";
import useStoreAuth from "../store/features/auth";
import Loader from "../components/Loader/Loader";
import Error from "../components/Modals/Error";
import { Link, useNavigate } from "react-router-dom";

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
            <div className="lg:w-3/5 w-full flex flex-col items-end justify-end lg:gap-2 gap-4">
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

                      <div className="flex lg:flex-row flex-col items-center justify-between lg:gap-4 gap-2">
                        <p className="text-sm font-normal text-gray-400 mt-2">
                          <span className="text-black">Expire date:</span>{" "}
                          {item.expiry_date}
                        </p>
                        <p className="text-sm font-normal text-gray-400 mt-2">
                          <span className="text-black">Last update:</span>{" "}
                          {item.updated_at}
                        </p>
                      </div>

                      <p className="lg:text-base text-[0.95em] mt-2">
                        {item.description}
                      </p>
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
