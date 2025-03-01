import { ColumnDef } from "@tanstack/react-table"
import { ICourseQuizResult, StudentsQuizResultType } from "@/interfaces/course.interface";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";

export const quizResultColumns: ColumnDef<ICourseQuizResult>[] = [
	{
		id: "name",
		header: () => (
			<div className="text-[#767575] text-[12px] font-semibold">Student</div>
		),
		cell: ({ row }) => {
			return (
				<div className="flex items-center gap-2">
					<Avatar className="rounded-md">
						<AvatarImage 
							src={row.original.studentsQuizResult.profilePicture ?? ''} 
						/>
						<AvatarFallback className="rounded-md">
							{row.original.studentsQuizResult.name?.[0]}
						</AvatarFallback>
					</Avatar>
					<div className="flex flex-col">
						<span className="font-medium text-[12px] text-primary">
							{`${row.original.studentsQuizResult.name}`}
						</span>
						<span className="text-[12px] text-[#898383]">
							{`${row.original.studentsQuizResult.email}`}
						</span>
					</div>
				</div>
			)
		},
	},
	{
		id: "quizTitle",
		header: () => (
			<div className="text-[#767575] text-[12px] font-semibold">
				Quiz Title
			</div>
		),
		cell: ({ row }) => {
			return <span className="flex items-center">
				<span className="text-[12px] text-[#898383]">
					{row.original.courseLessonItem.title.trim()}
				</span>
			</span>
		},
	},
	{
		id: "questionItems",
		header: () => (
			<div className="text-[#767575] text-[12px] font-semibold">
				Question Items
			</div>
		),
		cell: ({ row }) => {
			return <span className="flex items-center">
				<span className="text-[12px] text-[#898383]">
					{`${row.original.courseLessonItem.CourseLessonQuestionnaireItem.length} items`}
				</span>
			</span>
		},
	},
	{
		id: "score",
		header: () => (
			<div className="text-[#767575] text-[12px] font-semibold">
				Score
			</div>
		),
		cell: ({ row }) => {
			return <div className="flex items-center">
				<span className="text-[12px] text-[#898383]">
					{`${row.original.studentsQuizResult.score} points`}
				</span>
			</div>
		},
	},
]
