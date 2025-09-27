import React, { useState } from "react";
import { useParams } from "react-router-dom";

import BottomBar from "@/components/navigation/BottomBar";
import FocusedPost from "@/components/post/FocusedPost";

import PageTitle from "@/components/others/PageTitle";

const topNews = [
  {
    title: "Breaking News 1",
    description: "This is the description for breaking news 1.",
    category: "Business",
  },
  {
    title: "Breaking News 2",
    description: "This is the description for breaking news 2.",
    category: "Technology",
  },
  {
    title: "Breaking News 3",
    description: "This is the description for breaking news 3.",
    category: "Health",
  },
];

export default function PostsPage() {
  const { id } = useParams();
  const [postData, setPostData] = useState(null);

  return (
    <>
      <PageTitle title="NetVerses" />
      <BottomBar />
      <div className="flex flex-col justify-start items-center w-full h-full pt-24 bg-fixed bg-cover bg-center">
        <FocusedPost
          id={Number(id)}
          key={1}
          title={"New Features"}
          date={"2024-09-16T09:30:00Z"}
          description={"Say goodbye to the traditional news!"}
          author={"Xenon"}
          interactions={{
            likes: 95,
            dislikes: 4,
            views: 800,
            boosts: 35,
            comments: 1,
          }}
          isNSFW={false}
          comments={[
            {
              author: "TechGuru",
              date: "2024-09-16T09:30:00Z",
              text: "The new updates are fantastic!",
              interactions: {
                likes: 23,
                dislikes: 2,
              },
            },
            {
              author: "User123",
              date: "2024-09-16T09:30:00Z",
              text: "I appreciate the user-friendly interface.",
              interactions: {
                likes: 15,
                dislikes: 1,
              },
            },
            {
              author: "GamerGal",
              date: "2024-10-10T09:30:00Z",
              text: "This platform has changed the way I connect with friends!",
              interactions: {
                likes: 30,
                dislikes: 3,
              },
            },
            {
              author: "MovieBuff",
              date: "2024-09-16T09:30:00Z",
              text: "Excited to see more personalized recommendations!",
              interactions: {
                likes: 20,
                dislikes: 0,
              },
            },
            {
              author: "TravelLover",
              date: "2024-09-16T09:30:00Z",
              text: "The travel tips section is a game changer!",
              interactions: {
                likes: 18,
                dislikes: 1,
              },
            },
            {
              author: "MusicMaven",
              date: "2024-09-16T09:30:00Z",
              text: "Great playlist suggestions! Keep them coming.",
              interactions: {
                likes: 25,
                dislikes: 2,
              },
            },
            {
              author: "FitnessFreak",
              date: "2024-09-16T09:30:00Z",
              text: "I'm loving the fitness content tailored to my goals!",
              interactions: {
                likes: 27,
                dislikes: 1,
              },
            },
            {
              author: "BookWorm",
              date: "2024-09-16T09:30:00Z",
              text: "Fantastic book recommendations, can't wait to dive in!",
              interactions: {
                likes: 22,
                dislikes: 0,
              },
            },
            {
              author: "Foodie",
              date: "2024-09-16T09:30:00Z",
              text: "The recipes shared here are delicious and easy to follow!",
              interactions: {
                likes: 19,
                dislikes: 1,
              },
            },
            {
              author: "ArtAficionado",
              date: "2024-09-16T09:30:00Z",
              text: "Impressed by the range of artistic content available!",
              interactions: {
                likes: 21,
                dislikes: 2,
              },
            },
          ]}
        />
      </div>
    </>
  );
}
