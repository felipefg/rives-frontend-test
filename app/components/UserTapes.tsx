"use client"


import { useEffect, useState } from "react";
import { DecodedIndexerOutput } from "../backend-libs/cartesapp/lib";
import { getTapes } from "../utils/util";
import { VerifyPayload } from "../backend-libs/core/lib";
import { monogram } from "../utils/monogramExtendedFont";
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import NavigateBeforeIcon from '@mui/icons-material/NavigateBefore';
import TapeCard from "./TapeCard";
import Loading from "./Loading";


export default function UserTapes({address}:{address:string}) {
    const [tapesCreated, setTapesCreated] = useState<Array<Array<VerifyPayload>>>([]);
    const [tapesCreatedPage, setTapesCreatedPage] = useState({curr: 0, atEnd: false});
    
    const [tapesCollect, setTapesCollect] = useState<Array<Array<VerifyPayload>>>([]);
    const [tapesCollectedPage, setTapesCollectedPage] = useState({curr: 0, atEnd: false});
    
    const [tapesCreatedPageToLoad, setTapesCreatedPageToLoad] = useState(1);
    const [totalTapesCreatedPages, setTotalTapesCreatedPages] = useState(-1);

    const [tapesCollectedPageToLoad, setTapesCollectedPageToLoad] = useState(1);
    const [totalTapesCollectedPages, setTotalTapesCollectedPages] = useState(-1);

    const [tapesCreatedLoading, setTapesCreatedLoading] = useState(false);
    const [tapesCollectedLoading, setTapesCollectedLoading] = useState(false);

    const TapesCreatedByProfile = async () => {
        if (tapesCreatedPage.atEnd || tapesCreated[tapesCreatedPage.curr]) return;

        setTapesCreatedLoading(true);

        const page_size = 6;

        const res:DecodedIndexerOutput = await getTapes(
            {
                currentPage: tapesCreatedPageToLoad,
                pageSize: page_size,
                msg_sender: address,
                orderBy: "timestamp",
                orderDir: "desc"
            }
        )
    
        const new_total_pages = Math.ceil(res.total / page_size);
        if (totalTapesCreatedPages != new_total_pages) setTotalTapesCreatedPages(new_total_pages);

        setTapesCreated([...tapesCreated, res.data]);
        setTapesCreatedPage({curr: tapesCreatedPageToLoad, atEnd: res.total <= tapesCreatedPageToLoad * page_size});
        setTapesCreatedLoading(false);
    }

    const nextCreatedTapesPage = () => {
        setTapesCollectedPageToLoad(tapesCreatedPageToLoad+1);
    }

    const prevCreatedTapesPage = () => {
        setTapesCollectedPageToLoad(tapesCreatedPageToLoad-1);
    }

    const TapesCollectedByProfile = async () => {
    }

    const nextCollectedTapesPage = () => {
        setTapesCollectedPageToLoad(tapesCollectedPageToLoad+1);
    }

    const prevCollectedTapesPage = () => {
        setTapesCollectedPageToLoad(tapesCollectedPageToLoad-1);
    }


    useEffect(() => {
        TapesCreatedByProfile();
        TapesCollectedByProfile();
    }, [])

    useEffect(() => {
        TapesCreatedByProfile();
    }, [tapesCreatedPageToLoad])

    useEffect(() => {
        TapesCollectedByProfile();
    }, [tapesCollectedPageToLoad])


    return (
        <div>
            <div className="flex flex-col gap-4">
                <div className='w-full lg:w-[80%]'>
                        <h1 className={`text-5xl ${monogram.className}`}>Tapes Created</h1>
                </div>

                {
                    tapesCreatedLoading?
                        <Loading msg="Loading Created Tapes" />
                    :
                        <>
                            <div className="flex flex-wrap gap-4">
                                {
                                    tapesCreated[tapesCreatedPage.curr-1]?.map((tape, index) => {
                                        return (
                                            <TapeCard key={index} tapeInput={tape} />
                                        )
                                    })
                                }

                            </div>

                            {
                                tapesCreated.length == 0 || tapesCreated[0].length == 0?
                                    <></>
                                :
                                    <div className='flex justify-center items-center space-x-1'>
                                        <button disabled={tapesCreatedPage.curr == 1} onClick={nextCreatedTapesPage} className={`border border-transparent ${tapesCreatedPage.curr != 1? "hover:border-black":""}`}>
                                            <NavigateBeforeIcon />
                                        </button>
                                        <span>
                                            {tapesCreatedPage.curr} of {totalTapesCreatedPages}
                                        </span>
                                        <button disabled={tapesCreatedPage.atEnd} onClick={prevCreatedTapesPage} className={`border border-transparent ${!tapesCreatedPage.atEnd? "hover:border-black":""}`}>
                                            <NavigateNextIcon />                
                                        </button>
                                    </div>

                            }
                        </>
                }
            </div>

            <div className="flex flex-col gap-4">
                <div className='w-full lg:w-[80%]'>
                    <h1 className={`text-5xl ${monogram.className}`}>Tapes Collected</h1>
                </div>

                <div className="flex flex-wrap gap-4">
                    {
                        tapesCollect[tapesCollectedPage.curr-1]?.map((tape, index) => {
                            return (
                                <TapeCard key={index} tapeInput={tape} />
                            )
                        })
                    }

                </div>

                {
                    tapesCollect.length == 0 || tapesCollect[0].length == 0?
                        <></>
                    :
                        <div className='flex justify-center items-center space-x-1'>
                            <button disabled={tapesCollectedPage.curr == 1} onClick={nextCollectedTapesPage} className={`border border-transparent ${tapesCollectedPage.curr != 1? "hover:border-black":""}`}>
                                <NavigateBeforeIcon />
                            </button>
                            <span>
                                {tapesCollectedPage.curr} of {totalTapesCollectedPages}
                            </span>
                            <button disabled={tapesCollectedPage.atEnd} onClick={prevCollectedTapesPage} className={`border border-transparent ${!tapesCollectedPage.atEnd? "hover:border-black":""}`}>
                                <NavigateNextIcon />                
                            </button>
                        </div>
                }
            </div>
        </div>
    )
}