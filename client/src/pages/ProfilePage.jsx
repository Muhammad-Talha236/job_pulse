// src/pages/ProfilePage.jsx

import { useEffect, useState } from "react";

import {
  getProfile,
  saveProfile,
} from "../api/profileApi";


function ProfilePage() {

  const [loading, setLoading] = useState(true);

  const [saving, setSaving] = useState(false);

  const [error, setError] = useState("");

  const [success, setSuccess] = useState("");


  const [formData, setFormData] = useState({
    full_name: "",
    headline: "",
    bio: "",
    experience_level: "",
    years_of_experience: 0,
    preferred_location: "",
    preferred_job_type: "",
    preferred_work_mode: "",
    skills: [],
    preferred_roles: [],
    preferred_technologies: [],
  });


  const [skillsInput, setSkillsInput] = useState("");

  const [rolesInput, setRolesInput] = useState("");

  const [technologiesInput, setTechnologiesInput] =
    useState("");


  /*
   * =========================================================
   * Load Profile
   * =========================================================
   */

  useEffect(() => {

    const loadProfile = async () => {

      try {

        setLoading(true);
        setError("");

        const response = await getProfile();

        if (response.profile) {

          const profile = response.profile;

          setFormData({
            full_name: profile.full_name || "",
            headline: profile.headline || "",
            bio: profile.bio || "",
            experience_level:
              profile.experience_level || "",
            years_of_experience:
              profile.years_of_experience || 0,
            preferred_location:
              profile.preferred_location || "",
            preferred_job_type:
              profile.preferred_job_type || "",
            preferred_work_mode:
              profile.preferred_work_mode || "",
            skills: profile.skills || [],
            preferred_roles:
              profile.preferred_roles || [],
            preferred_technologies:
              profile.preferred_technologies || [],
          });

        }

      } catch (error) {

        console.error(
          "Failed to load profile:",
          error
        );

        setError(
          error.response?.data?.message ||
          "Unable to load profile"
        );

      } finally {

        setLoading(false);

      }
    };


    loadProfile();

  }, []);


  /*
   * =========================================================
   * Handle Input
   * =========================================================
   */

  const handleChange = (event) => {

    const {
      name,
      value,
    } = event.target;

    setFormData((current) => ({
      ...current,
      [name]: value,
    }));

  };


  /*
   * =========================================================
   * Add Items
   * =========================================================
   */

  const addItem = (
    input,
    field,
    setInput
  ) => {

    const value = input.trim();

    if (!value) {
      return;
    }

    if (
      formData[field].includes(value)
    ) {
      setInput("");
      return;
    }

    setFormData((current) => ({
      ...current,
      [field]: [
        ...current[field],
        value,
      ],
    }));

    setInput("");

  };


  /*
   * =========================================================
   * Remove Item
   * =========================================================
   */

  const removeItem = (
    field,
    value
  ) => {

    setFormData((current) => ({
      ...current,

      [field]: current[field].filter(
        (item) => item !== value
      ),
    }));

  };


  /*
   * =========================================================
   * Handle Enter
   * =========================================================
   */

  const handleTagKeyDown = (
    event,
    input,
    field,
    setInput
  ) => {

    if (event.key === "Enter") {

      event.preventDefault();

      addItem(
        input,
        field,
        setInput
      );

    }

  };


  /*
   * =========================================================
   * Save Profile
   * =========================================================
   */

  const handleSubmit = async (event) => {

    event.preventDefault();

    try {

      setSaving(true);

      setError("");

      setSuccess("");


      /*
       * Add anything still sitting inside
       * the tag inputs.
       */

      const finalSkills = [
        ...formData.skills,
      ];

      const finalRoles = [
        ...formData.preferred_roles,
      ];

      const finalTechnologies = [
        ...formData.preferred_technologies,
      ];


      if (
        skillsInput.trim() &&
        !finalSkills.includes(
          skillsInput.trim()
        )
      ) {

        finalSkills.push(
          skillsInput.trim()
        );

      }


      if (
        rolesInput.trim() &&
        !finalRoles.includes(
          rolesInput.trim()
        )
      ) {

        finalRoles.push(
          rolesInput.trim()
        );

      }


      if (
        technologiesInput.trim() &&
        !finalTechnologies.includes(
          technologiesInput.trim()
        )
      ) {

        finalTechnologies.push(
          technologiesInput.trim()
        );

      }


      const payload = {
        ...formData,

        years_of_experience:
          Number(
            formData.years_of_experience
          ),

        skills: finalSkills,

        preferred_roles: finalRoles,

        preferred_technologies:
          finalTechnologies,
      };


      const response =
        await saveProfile(payload);


      setFormData((current) => ({
        ...current,

        skills: finalSkills,

        preferred_roles: finalRoles,

        preferred_technologies:
          finalTechnologies,
      }));


      setSkillsInput("");
      setRolesInput("");
      setTechnologiesInput("");


      setSuccess(
        response.message ||
        "Profile saved successfully"
      );

    } catch (error) {

      console.error(
        "Save profile failed:",
        error
      );

      setError(
        error.response?.data?.message ||
        "Unable to save profile"
      );

    } finally {

      setSaving(false);

    }

  };


  /*
   * =========================================================
   * Loading
   * =========================================================
   */

  if (loading) {

    return (
      <div className="flex min-h-[400px] items-center justify-center">

        <p className="text-sm text-slate-500">
          Loading profile...
        </p>

      </div>
    );

  }


  return (

    <div className="mx-auto max-w-4xl space-y-6">

      {/* Header */}

      <div>

        <h1 className="text-3xl font-bold tracking-tight text-slate-900">
          Your Profile
        </h1>

        <p className="mt-2 text-sm leading-6 text-slate-500">
          Tell JobPulse about your skills and preferences
          so we can find better opportunities for you.
        </p>

      </div>


      {/* Alerts */}

      {error && (

        <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>

      )}


      {success && (

        <div className="rounded-xl border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700">
          {success}
        </div>

      )}


      {/* Form */}

      <form
        onSubmit={handleSubmit}
        className="space-y-6"
      >

        {/* =================================================
            Basic Information
        ================================================= */}

        <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">

          <div className="mb-6">

            <h2 className="text-lg font-semibold text-slate-900">
              Basic Information
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              Basic information about you and your
              professional background.
            </p>

          </div>


          <div className="grid gap-5 md:grid-cols-2">

            {/* Full Name */}

            <div>

              <label
                htmlFor="full_name"
                className="mb-2 block text-sm font-medium text-slate-700"
              >
                Full Name
              </label>

              <input
                id="full_name"
                name="full_name"
                value={formData.full_name}
                onChange={handleChange}
                required
                placeholder="Your full name"
                className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
              />

            </div>


            {/* Headline */}

            <div>

              <label
                htmlFor="headline"
                className="mb-2 block text-sm font-medium text-slate-700"
              >
                Professional Headline
              </label>

              <input
                id="headline"
                name="headline"
                value={formData.headline}
                onChange={handleChange}
                placeholder="e.g. MERN Stack Developer"
                className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
              />

            </div>

          </div>


          {/* Bio */}

          <div className="mt-5">

            <label
              htmlFor="bio"
              className="mb-2 block text-sm font-medium text-slate-700"
            >
              Bio
            </label>

            <textarea
              id="bio"
              name="bio"
              rows={4}
              value={formData.bio}
              onChange={handleChange}
              placeholder="Briefly describe your professional background..."
              className="w-full resize-none rounded-xl border border-slate-300 px-4 py-3 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
            />

          </div>

        </section>


        {/* =================================================
            Experience
        ================================================= */}

        <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">

          <div className="mb-6">

            <h2 className="text-lg font-semibold text-slate-900">
              Experience
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              Help JobPulse understand your experience level.
            </p>

          </div>


          <div className="grid gap-5 md:grid-cols-2">

            {/* Experience Level */}

            <div>

              <label
                htmlFor="experience_level"
                className="mb-2 block text-sm font-medium text-slate-700"
              >
                Experience Level
              </label>

              <select
                id="experience_level"
                name="experience_level"
                value={formData.experience_level}
                onChange={handleChange}
                className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
              >

                <option value="">
                  Select level
                </option>

                <option value="Student">
                  Student
                </option>

                <option value="Internship">
                  Internship
                </option>

                <option value="Junior">
                  Junior
                </option>

                <option value="Mid-level">
                  Mid-level
                </option>

                <option value="Senior">
                  Senior
                </option>

              </select>

            </div>


            {/* Years */}

            <div>

              <label
                htmlFor="years_of_experience"
                className="mb-2 block text-sm font-medium text-slate-700"
              >
                Years of Experience
              </label>

              <input
                id="years_of_experience"
                name="years_of_experience"
                type="number"
                min="0"
                value={
                  formData.years_of_experience
                }
                onChange={handleChange}
                className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
              />

            </div>

          </div>

        </section>


        {/* =================================================
            Job Preferences
        ================================================= */}

        <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">

          <div className="mb-6">

            <h2 className="text-lg font-semibold text-slate-900">
              Job Preferences
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              These preferences will help us discover
              relevant jobs for you.
            </p>

          </div>


          <div className="grid gap-5 md:grid-cols-3">

            {/* Location */}

            <div>

              <label
                htmlFor="preferred_location"
                className="mb-2 block text-sm font-medium text-slate-700"
              >
                Preferred Location
              </label>

              <input
                id="preferred_location"
                name="preferred_location"
                value={
                  formData.preferred_location
                }
                onChange={handleChange}
                placeholder="e.g. Remote"
                className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
              />

            </div>


            {/* Job Type */}

            <div>

              <label
                htmlFor="preferred_job_type"
                className="mb-2 block text-sm font-medium text-slate-700"
              >
                Job Type
              </label>

              <select
                id="preferred_job_type"
                name="preferred_job_type"
                value={
                  formData.preferred_job_type
                }
                onChange={handleChange}
                className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
              >

                <option value="">
                  Select type
                </option>

                <option value="Full-time">
                  Full-time
                </option>

                <option value="Part-time">
                  Part-time
                </option>

                <option value="Contract">
                  Contract
                </option>

                <option value="Internship">
                  Internship
                </option>

                <option value="Freelance">
                  Freelance
                </option>

              </select>

            </div>


            {/* Work Mode */}

            <div>

              <label
                htmlFor="preferred_work_mode"
                className="mb-2 block text-sm font-medium text-slate-700"
              >
                Work Mode
              </label>

              <select
                id="preferred_work_mode"
                name="preferred_work_mode"
                value={
                  formData.preferred_work_mode
                }
                onChange={handleChange}
                className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
              >

                <option value="">
                  Select mode
                </option>

                <option value="Remote">
                  Remote
                </option>

                <option value="Hybrid">
                  Hybrid
                </option>

                <option value="On-site">
                  On-site
                </option>

              </select>

            </div>

          </div>

        </section>


        {/* =================================================
            Skills
        ================================================= */}

        <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">

          <div className="mb-6">

            <h2 className="text-lg font-semibold text-slate-900">
              Skills
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              Add the skills JobPulse should use when
              finding relevant jobs.
            </p>

          </div>


          <div className="flex gap-3">

            <input
              value={skillsInput}
              onChange={(event) =>
                setSkillsInput(
                  event.target.value
                )
              }
              onKeyDown={(event) =>
                handleTagKeyDown(
                  event,
                  skillsInput,
                  "skills",
                  setSkillsInput
                )
              }
              placeholder="e.g. React"
              className="flex-1 rounded-xl border border-slate-300 px-4 py-3 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
            />

            <button
              type="button"
              onClick={() =>
                addItem(
                  skillsInput,
                  "skills",
                  setSkillsInput
                )
              }
              className="rounded-xl bg-slate-900 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-800"
            >
              Add
            </button>

          </div>


          <div className="mt-4 flex flex-wrap gap-2">

            {formData.skills.map(
              (skill) => (

                <button
                  type="button"
                  key={skill}
                  onClick={() =>
                    removeItem(
                      "skills",
                      skill
                    )
                  }
                  className="rounded-full bg-blue-50 px-3 py-1.5 text-sm font-medium text-blue-700 transition hover:bg-blue-100"
                  title="Remove skill"
                >
                  {skill} ×
                </button>

              )
            )}

          </div>

        </section>


        {/* =================================================
            Preferred Roles
        ================================================= */}

        <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">

          <div className="mb-6">

            <h2 className="text-lg font-semibold text-slate-900">
              Preferred Roles
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              Tell us which roles you want to discover.
            </p>

          </div>


          <div className="flex gap-3">

            <input
              value={rolesInput}
              onChange={(event) =>
                setRolesInput(
                  event.target.value
                )
              }
              onKeyDown={(event) =>
                handleTagKeyDown(
                  event,
                  rolesInput,
                  "preferred_roles",
                  setRolesInput
                )
              }
              placeholder="e.g. MERN Developer"
              className="flex-1 rounded-xl border border-slate-300 px-4 py-3 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
            />

            <button
              type="button"
              onClick={() =>
                addItem(
                  rolesInput,
                  "preferred_roles",
                  setRolesInput
                )
              }
              className="rounded-xl bg-slate-900 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-800"
            >
              Add
            </button>

          </div>


          <div className="mt-4 flex flex-wrap gap-2">

            {formData.preferred_roles.map(
              (role) => (

                <button
                  type="button"
                  key={role}
                  onClick={() =>
                    removeItem(
                      "preferred_roles",
                      role
                    )
                  }
                  className="rounded-full bg-indigo-50 px-3 py-1.5 text-sm font-medium text-indigo-700 transition hover:bg-indigo-100"
                >
                  {role} ×
                </button>

              )
            )}

          </div>

        </section>


        {/* =================================================
            Technologies
        ================================================= */}

        <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">

          <div className="mb-6">

            <h2 className="text-lg font-semibold text-slate-900">
              Preferred Technologies
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              Technologies you prefer working with.
            </p>

          </div>


          <div className="flex gap-3">

            <input
              value={technologiesInput}
              onChange={(event) =>
                setTechnologiesInput(
                  event.target.value
                )
              }
              onKeyDown={(event) =>
                handleTagKeyDown(
                  event,
                  technologiesInput,
                  "preferred_technologies",
                  setTechnologiesInput
                )
              }
              placeholder="e.g. Next.js"
              className="flex-1 rounded-xl border border-slate-300 px-4 py-3 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
            />

            <button
              type="button"
              onClick={() =>
                addItem(
                  technologiesInput,
                  "preferred_technologies",
                  setTechnologiesInput
                )
              }
              className="rounded-xl bg-slate-900 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-800"
            >
              Add
            </button>

          </div>


          <div className="mt-4 flex flex-wrap gap-2">

            {formData.preferred_technologies.map(
              (technology) => (

                <button
                  type="button"
                  key={technology}
                  onClick={() =>
                    removeItem(
                      "preferred_technologies",
                      technology
                    )
                  }
                  className="rounded-full bg-purple-50 px-3 py-1.5 text-sm font-medium text-purple-700 transition hover:bg-purple-100"
                >
                  {technology} ×
                </button>

              )
            )}

          </div>

        </section>


        {/* =================================================
            Save
        ================================================= */}

        <div className="flex justify-end">

          <button
            type="submit"
            disabled={saving}
            className="rounded-xl bg-blue-600 px-6 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {saving
              ? "Saving..."
              : "Save Profile"}
          </button>

        </div>

      </form>

    </div>
  );
}


export default ProfilePage;