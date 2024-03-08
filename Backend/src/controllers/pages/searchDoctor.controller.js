import { checkIfUserLoggedIn } from "../../middlewares/checkForLogin.middleware.js";
import { Doctor } from "../../models/doctorDetails.model.js";
import { User } from "../../models/user.model.js";
import { asyncHandler } from "../../utils/asyncHandler.js";

export const seachDoctor = asyncHandler(async (req, res) => {
    const { doctorFilter, city } = req.body
    const { loggedUser } = req
    const status = "approved"
    const specialty = doctorFilter.toLocaleLowerCase()

    if (!city) {
        const doctors = await Doctor.find({ specialty, status });
        console.log(doctors);
        if (!doctors) {
            res.status(500).json({
                message: "not found"
            })
        }
        const users = await User.find({ isDoctor: true })
        if (!loggedUser) {
            return res.render("search", { doctors, users, loggedUser: "none" })
        }
        // console.log(users);
        return res.render("search", { doctors, users, loggedUser })

    } else if (!doctorFilter) {
        const doctors = await Doctor.find({ status });
        console.log(doctors);
        if (!doctors) {
            res.status(500).json({
                message: "not found"
            })
        }
        const users = await User.find({ isDoctor: true, city })
        if (!loggedUser) {
            return res.render("search", { doctors, users, loggedUser: "none" })
        }
        // console.log(users);
        return res.render("search", { doctors, users, loggedUser })

    } else {

        const doctors = await Doctor.find({ specialty, status });
        console.log(doctors);
        if (!doctors) {
            res.status(500).json({
                message: "not found"
            })
        }
        const users = await User.find({ isDoctor: true, city })
        if (!loggedUser) {
            return res.render("search", { doctors, users, loggedUser: "none" })
        }
        // console.log(users);
        return res.render("search", { doctors, users, loggedUser })


    }


})

export const seachDoctorCategory = asyncHandler(async (req, res) => {
    const { doctorFilter } = req.params
    const { loggedUser } = req
    const status = "approved"
    const doctors = await Doctor.find({ specialty: doctorFilter, status });
    console.log(doctors);
    if (!doctors) {
        res.status(500).json({
            message: "not found"
        })
    }
    const users = await User.find({ isDoctor: true })
    if (!loggedUser) {
        return res.render("search-filter", { doctors, users, loggedUser: "none" })
    }
    // console.log(users);
    return res.render("search-filter", { doctors, users, loggedUser })

})
export const doctorProfile = asyncHandler(async (req, res) => {
    const { doctorId } = req.params
    const { loggedUser } = req

    const doctor = await Doctor.findById(doctorId)
    console.log(doctor);
    const id = doctor.userId
    console.log(id);
    const user = await User.findById(id)

    if (!loggedUser) {
        res.redirect("/login")
    }
    if (!user) {
        res.redirect("/")
    }
    console.log(user);
    res.render("doctor-profile", { doctor, user, loggedUser })
})