import { widgetProps } from "src";
import useSWR from "swr";

export const useGetWidget = (widget_id: string): widgetProps => {
  const url = `https://krosai.azurewebsites.net/${widget_id}`;

  const fetcher = (url) => fetch(url).then((res) => res.json());

  const { data, error, isLoading } = useSWR(url, fetcher);

  return data;
};
