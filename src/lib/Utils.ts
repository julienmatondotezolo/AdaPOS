export function isMainCourse({
  allMainCoursesCategoryIds,
  categoryId,
}: {
  allMainCoursesCategoryIds: any[] | undefined;
  categoryId: string;
}) {
  const filteredIds = allMainCoursesCategoryIds?.map((mainCourseCategory: any) => mainCourseCategory.id);

  if (filteredIds?.includes(categoryId)) {
    return true;
  } else {
    return false;
  }
}
