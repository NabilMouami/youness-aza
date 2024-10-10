import React, { useState } from "react";
import { toast } from "react-toastify";
import axios from "axios";
import { config_url } from "../../config";
import {
  Radio,
  RadioGroup,
  FormControlLabel,
  FormControl,
  FormLabel,
  Box,
} from "@mui/material";

const roles = ["Admin", "Super-Admin"];

function AddUser() {
  const [firstName, setNom] = useState("");
  const [lastName, setPrenom] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("Super-Admin");

  const post = { firstName, lastName, email, password, role };

  const submitHandler = (e) => {
    e.preventDefault();
    axios.post(`${config_url}/api/users`, post).then(() => {
      toast.success("Ajoute Utilisateur Success !!", {
        position: "top-right",
      });
    });
  };

  const handleSelect = (e) => {
    setRole(e.target.value);
  };

  return (
    <div className="w-full mt-10 sm:mt-0">
      <div className="md:grid md:grid-cols-3 md:gap-6">
        <div className="md:col-span-6">
          <div className="px-4 sm:px-0">
            <h3 className="text-center text-3xl font-bold leading-6 text-gray-900 mt-10">
              Save Information About User Application:
            </h3>
          </div>
        </div>
        <div className="mt-5 md:col-span-4 md:mt-18">
          <form onSubmit={submitHandler}>
            <div className="overflow-hidden shadow text-black sm:rounded-md">
              <div className="m-2 rounded-2xl shadow border-dashed border-4 border-teal-500 bg-white px-4 py-5 sm:p-6">
                <div className="grid grid-cols-6 gap-6">
                  <div className="col-span-6 sm:col-span-2">
                    <label
                      htmlFor="first-name"
                      className="font-bold text-xl block text-gray-700"
                    >
                      Nom:
                    </label>
                    <input
                      type="text"
                      name="nom"
                      autoComplete="given-name"
                      className="w-full px-4 py-2 text-base border border-gray-300 rounded outline-none focus:ring-blue-500 focus:border-blue-500 focus:ring-1"
                      onChange={(e) => setNom(e.target.value)}
                    />
                  </div>

                  <div className="col-span-6 sm:col-span-2">
                    <label
                      htmlFor="last-name"
                      className="font-bold text-xl block text-gray-700"
                    >
                      Prenom:
                    </label>
                    <input
                      type="text"
                      name="prenom"
                      autoComplete="family-name"
                      className="w-full px-4 py-2 text-base border border-gray-300 rounded outline-none focus:ring-blue-500 focus:border-blue-500 focus:ring-1"
                      onChange={(e) => setPrenom(e.target.value)}
                    />
                  </div>

                  <div className="col-span-2 sm:col-span-2">
                    <label
                      htmlFor="email-address"
                      className="font-bold text-xl block text-gray-700"
                    >
                      Email:
                    </label>
                    <input
                      type="text"
                      name="email"
                      autoComplete="email"
                      className="w-full px-4 py-2 text-base border border-gray-300 rounded outline-none focus:ring-blue-500 focus:border-blue-500 focus:ring-1"
                      onChange={(e) => setEmail(e.target.value)}
                    />
                  </div>

                  <div className="col-span-6 sm:col-span-2">
                    <label
                      htmlFor="password"
                      className="font-bold text-xl block text-gray-700"
                    >
                      Password:
                    </label>
                    <input
                      type="password"
                      name="password"
                      autoComplete="new-password"
                      className="w-full px-4 py-2 text-base border border-gray-300 rounded outline-none focus:ring-blue-500 focus:border-blue-500 focus:ring-1"
                      onChange={(e) => setPassword(e.target.value)}
                    />
                  </div>

                  <div className="col-span-6">
                    <Box
                      display="flex"
                      flexDirection="column"
                      alignItems="center"
                      justifyContent="center"
                      gap={3}
                    >
                      <FormLabel component="legend">Roles</FormLabel>
                      <FormControl component="fieldset">
                        <RadioGroup
                          row
                          aria-label="roles"
                          name="roles"
                          value={role}
                          onChange={handleSelect}
                          style={{
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            gap: "1rem",
                          }}
                        >
                          {roles.map((role) => (
                            <FormControlLabel
                              key={role}
                              value={role}
                              control={<Radio />}
                              label={role}
                            />
                          ))}
                        </RadioGroup>
                      </FormControl>
                    </Box>
                  </div>
                </div>
                <div className="px-4 py-3 text-right sm:px-6">
                  <button
                    type="submit"
                    className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-teal-600 hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500"
                  >
                    Save
                  </button>
                </div>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default AddUser;
